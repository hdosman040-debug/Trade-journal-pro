import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BarChart3, Settings } from 'lucide-react';

export const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500" : "text-slate-400"}>
          <LayoutDashboard size={24} />
        </NavLink>
        <NavLink to="/journal" className={({ isActive }) => isActive ? "text-blue-500" : "text-slate-400"}>
          <BookOpen size={24} />
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? "text-blue-500" : "text-slate-400"}>
          <BarChart3 size={24} />
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "text-blue-500" : "text-slate-400"}>
          <Settings size={24} />
        </NavLink>
      </nav>
    </div>
  );
};
