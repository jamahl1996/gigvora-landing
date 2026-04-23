import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquare, X, Maximize2, Minimize2, Search, UserPlus, Users, Hash, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { listMyConversations, type ConversationListItem } from "@/lib/messaging";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Tab = "chats" | "groups" | "channels" | "people";

export function MessagesBubble() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<Tab>("chats");
  const [convs, setConvs] = useState<ConversationListItem[]>([]);
  const [q, setQ] = useState("");
  const unread = convs.reduce((n, c) => n + (c.unread ?? 0), 0);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const load = () => listMyConversations(user.id).then((r) => mounted && setConvs(r)).catch(() => {});
    load();
    const ch = supabase
      .channel("msg-bubble")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, load)
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, [user]);

  if (!user) return null;

  const filtered = convs.filter((c) =>
    !q ? true : (c.subject ?? c.peer_name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
        style={{ boxShadow: "var(--shadow-elegant)" }}
        aria-label="Open messages"
      >
        <MessageSquare className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl",
            expanded
              ? "bottom-6 right-6 h-[640px] w-[480px]"
              : "bottom-24 right-6 h-[560px] w-[400px]"
          )}
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-4 py-3 text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-base font-semibold">Messages</span>
            {unread > 0 && (
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs">{unread}</span>
            )}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="rounded-md p-1.5 hover:bg-white/15"
                aria-label="Resize"
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <Link
                to="/inbox"
                className="rounded-md p-1.5 hover:bg-white/15"
                aria-label="Open full inbox"
                onClick={() => setOpen(false)}
              >
                <Maximize2 className="h-4 w-4 rotate-45" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 hover:bg-white/15"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border/60 px-2 py-2">
            {([
              { k: "chats", label: "Chats", icon: MessageSquare },
              { k: "groups", label: "Groups", icon: Users },
              { k: "channels", label: "Channels", icon: Hash },
              { k: "people", label: "People", icon: UserPlus },
            ] as { k: Tab; label: string; icon: typeof MessageSquare }[]).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  tab === t.k
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Search + actions */}
          <div className="border-b border-border/60 px-3 py-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={`Search ${tab}...`}
                className="h-9 rounded-full pl-9"
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                <Link to="/inbox" onClick={() => setOpen(false)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> New Chat
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-full">
                <Link to="/inbox" onClick={() => setOpen(false)}>
                  <Users className="mr-1 h-3.5 w-3.5" /> New Group
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="rounded-full">
                <Link to="/inbox" onClick={() => setOpen(false)}>
                  Full Inbox
                </Link>
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 opacity-40" />
                <p className="font-medium text-foreground">No conversations yet</p>
                <p className="text-xs">Start a chat from a profile, gig, or job application.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {filtered.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/inbox"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <Avatar className="h-10 w-10">
                        {c.peer_avatar ? <AvatarImage src={c.peer_avatar} /> : null}
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {(c.peer_name ?? c.subject ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {c.peer_name ?? c.subject ?? "Conversation"}
                          </p>
                          <span className="flex-none text-[11px] text-muted-foreground">
                            {formatTime(c.last_message_at)}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.last_message ?? "No messages yet"}
                        </p>
                      </div>
                      {(c.unread ?? 0) > 0 && (
                        <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function formatTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString();
}
