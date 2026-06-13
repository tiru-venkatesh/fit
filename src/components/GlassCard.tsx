import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  id?: string;
  key?: any;
  className?: string;
  hoverEffect?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function GlassCard({ children, id, className = '', hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <div
      id={id}
      className={`
        relative overflow-hidden rounded-[32px] border border-white/10 
        bg-white/5 p-6 backdrop-blur-xl transition-all duration-300
        ${hoverEffect ? 'hover:-translate-y-1 hover:border-orange-500/20 hover:shadow-[0_20px_50px_rgba(249,115,22,0.06)]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Decorative orange ambient glow */}
      {hoverEffect && (
        <div className="absolute -top-10 -right-10 -z-10 h-28 w-28 rounded-full bg-orange-500/5 blur-2xl transition-all duration-300 pointer-events-none" />
      )}
      {children}
    </div>
  );
}
