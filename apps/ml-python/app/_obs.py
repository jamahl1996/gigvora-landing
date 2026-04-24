"""
Shared observability + safety primitives for the Gigvora ML service.

Provides:
  • install_observability(app)  — request-id + JSON access log + Prometheus /metrics
  • payload_guard(...)          — uniform DoS guard (item count + body size caps)
  • track(name)                 — context manager that records latency histograms
                                  and increments per-endpoint counters

Design goals:
  • Zero impact on hot path when metrics are scraped infrequently
  • Deterministic — no global mutable state beyond Prometheus registries
  • Safe defaults that match the SLO doc (`docs/architecture/slo-ml-python.md`)
"""
from __future__ import annotations

import json
import logging
import os
import time
import uuid
from contextlib import contextmanager
from typing import Iterable

import structlog
from fastapi import FastAPI, HTTPException, Request, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    Counter,
    Histogram,
    generate_latest,
)

# ---------------------------------------------------------------------------
# Structured logging
# ---------------------------------------------------------------------------

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"), format="%(message)s")
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
)
log = structlog.get_logger("gigvora.ml")

# ---------------------------------------------------------------------------
# Prometheus metrics — single registry per process (importable by tests)
# ---------------------------------------------------------------------------

REGISTRY = CollectorRegistry(auto_describe=True)

REQS = Counter(
    "ml_requests_total",
    "Total ML requests by endpoint and outcome.",
    labelnames=("endpoint", "outcome"),
    registry=REGISTRY,
)

LAT = Histogram(
    "ml_request_latency_seconds",
    "Per-endpoint latency histogram.",
    labelnames=("endpoint",),
    buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0),
    registry=REGISTRY,
)

FALLBACKS = Counter(
    "ml_fallbacks_total",
    "Number of times an endpoint chose a deterministic fallback path.",
    labelnames=("endpoint",),
    registry=REGISTRY,
)

# ---------------------------------------------------------------------------
# DoS guard — uniform across endpoints
# ---------------------------------------------------------------------------

# 50 KB body caps and 500-item lists are sufficient for the largest enterprise
# discovery query observed in load tests. Anything bigger is paginated.
DEFAULT_MAX_BODY_BYTES = 50_000
DEFAULT_MAX_ITEMS = 500


def _max_body_bytes() -> int:
    return int(os.environ.get("ML_MAX_BODY_BYTES", DEFAULT_MAX_BODY_BYTES))


def _max_items() -> int:
    return int(os.environ.get("ML_MAX_ITEMS", DEFAULT_MAX_ITEMS))


def payload_guard(*, items: Iterable | None = None, raw_body: bytes | None = None) -> None:
    """Raise HTTP 413 if the request exceeds size or item caps. Idempotent."""
    body_cap = _max_body_bytes()
    items_cap = _max_items()
    if raw_body is not None and len(raw_body) > body_cap:
        raise HTTPException(status_code=413, detail=f"payload exceeds {body_cap}B cap")
    if items is not None:
        try:
            n = len(items)  # type: ignore[arg-type]
        except TypeError:
            n = sum(1 for _ in items)
        if n > items_cap:
            raise HTTPException(status_code=413, detail=f"item count {n} exceeds {items_cap} cap")


# ---------------------------------------------------------------------------
# Latency tracking helper used inside endpoint bodies
# ---------------------------------------------------------------------------


@contextmanager
def track(endpoint: str, *, fallback_flag: dict | None = None):
    """
    Context manager that records latency + outcome. Pass a `fallback_flag`
    dict like {"used": False} and set ["used"] = True from inside the block
    to bump the fallback counter automatically.
    """
    start = time.perf_counter()
    outcome = "ok"
    try:
        yield
    except HTTPException as e:
        outcome = f"http_{e.status_code}"
        raise
    except Exception:
        outcome = "error"
        raise
    finally:
        elapsed = time.perf_counter() - start
        LAT.labels(endpoint=endpoint).observe(elapsed)
        REQS.labels(endpoint=endpoint, outcome=outcome).inc()
        if fallback_flag and fallback_flag.get("used"):
            FALLBACKS.labels(endpoint=endpoint).inc()


# ---------------------------------------------------------------------------
# FastAPI wiring
# ---------------------------------------------------------------------------


def install_observability(app: FastAPI) -> None:
    """Mount /metrics and attach a request-id + JSON access log middleware."""

    @app.middleware("http")
    async def _obs_middleware(request: Request, call_next):
        rid = request.headers.get("x-request-id") or uuid.uuid4().hex
        structlog.contextvars.bind_contextvars(request_id=rid, path=request.url.path)
        start = time.perf_counter()
        try:
            response: Response = await call_next(request)
        except Exception as exc:
            log.error("request.crash", error=str(exc))
            structlog.contextvars.clear_contextvars()
            raise
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        response.headers["x-request-id"] = rid
        log.info(
            "request.done",
            method=request.method,
            status=response.status_code,
            latency_ms=elapsed_ms,
        )
        structlog.contextvars.clear_contextvars()
        return response

    @app.get("/metrics", include_in_schema=False)
    def metrics() -> Response:
        return Response(generate_latest(REGISTRY), media_type=CONTENT_TYPE_LATEST)
