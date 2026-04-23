/**
 * Phase 9.2 — LiveDataPanel
 *
 * Reusable wrapper that shows a "Live" rail above the legacy mock UI on
 * pages we are progressively wiring to real Supabase data. Renders a
 * loading skeleton, an error toast, an empty state, and the children with
 * the live rows.
 *
 * Used by Proposals / Contracts / Groups pages in this phase. Subsequent
 * phases can replace the mock blocks below it once shape adapters land.
 */
import React from 'react';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveDataPanelProps<T> {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data: T[] | undefined;
  emptyLabel?: string;
  action?: React.ReactNode;
  children: (rows: T[]) => React.ReactNode;
  className?: string;
}

export function LiveDataPanel<T>(props: LiveDataPanelProps<T>) {
  const { title, subtitle, isLoading, isError, error, data, emptyLabel, action, children, className } = props;
  const rows = data ?? [];

  return (
    <section className={cn('rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-card to-card p-4 shadow-sm', className)}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          <div>
            <h2 className="text-[11px] font-bold leading-tight">{title} <span className="ml-1 rounded-md bg-accent/15 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-accent">Live</span></h2>
            {subtitle && <p className="text-[9px] text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>

      {isLoading && (
        <div className="flex items-center gap-2 py-6 text-[11px] text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading live records…
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[11px] text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Could not load records</div>
            <div className="text-[10px] opacity-80">{error instanceof Error ? error.message : 'Unknown error'}</div>
          </div>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-border/50 p-6 text-center text-[11px] text-muted-foreground">
          {emptyLabel ?? 'No records yet. Create one to populate this list.'}
        </div>
      )}

      {!isLoading && !isError && rows.length > 0 && (
        <div className="space-y-2">{children(rows)}</div>
      )}
    </section>
  );
}