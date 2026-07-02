import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Settings } from "lucide-react";
import { cn } from "../lib/utils";

export function Navigation() {
  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/journal",
      label: "Journal",
      icon: BookOpen,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background-card border-t border-border px-4 pb-safe">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all duration-200 no-tap-highlight",
                isActive
                  ? "text-trade-long"
                  : "text-foreground-muted hover:text-foreground"
              )
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}