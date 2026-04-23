/**
 * EmptyStateCTA — standardised "no-dead-end" recovery primitive.
 *
 * Phase 04 deliverable: every empty state, error state, or unauthorised
 * state in the app should render this component instead of leaving the
 * user on a blank page with no recovery path.
 *
 * Default actions always include a route-back path (the section home or
 * the dashboard) so the user is never stranded.
 *
 * Usage:
 *   <EmptyStateCTA
 *     icon={Inbox}
 *     title="No conversations yet"
 *     description="Reach out to a connection to start a chat."
 *     primaryAction={{ label: 'Browse network', to: '/networking' }}
 *     secondaryAction={{ label: 'Back to feed', to: '/feed' }}
 *   />
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyAction {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export interface EmptyStateCTAProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: EmptyAction;
  /** Always rendered — defaults to "Back to dashboard" so no page is a dead end. */
  secondaryAction?: EmptyAction;
  className?: string;
}

const FALLBACK_SECONDARY: EmptyAction = {
  label: 'Back to dashboard',
  to: '/dashboard',
  variant: 'ghost',
};

export const EmptyStateCTA: React.FC<EmptyStateCTAProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  primaryAction,
  secondaryAction = FALLBACK_SECONDARY,
  className,
}) => {
  const renderAction = (action: EmptyAction, isPrimary: boolean) => {
    const variant = action.variant ?? (isPrimary ? 'default' : 'ghost');
    const content = action.label;
    if (action.to) {
      return (
        <Button key={action.label} variant={variant} size="sm" asChild>
          <Link to={action.to}>{content}</Link>
        </Button>
      );
    }
    return (
      <Button key={action.label} variant={variant} size="sm" onClick={action.onClick}>
        {content}
      </Button>
    );
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {primaryAction ? renderAction(primaryAction, true) : null}
        {secondaryAction ? renderAction(secondaryAction, false) : null}
      </div>
    </div>
  );
};

export default EmptyStateCTA;