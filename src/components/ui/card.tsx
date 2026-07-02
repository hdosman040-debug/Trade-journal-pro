import { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
};
