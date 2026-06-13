import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon = Inbox, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-zinc-950/20 py-12 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/60 text-zinc-400">
        <Icon className="h-6 w-6 text-orange-500/80" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-200">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600 hover:shadow-[0_4px_20px_rgba(249,115,22,0.3)] active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
