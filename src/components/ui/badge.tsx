export const Badge = ({ status }: { status: 'win' | 'loss' | 'be' }) => {
  const styles = {
    win: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    loss: 'bg-red-500/10 text-red-400 border-red-500/20',
    be: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
};
