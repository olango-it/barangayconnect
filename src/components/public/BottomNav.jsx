import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Newspaper, User } from "lucide-react";

const tabs = [
  { label: "Home", path: "/", icon: Home },
  { label: "Services", path: "/services", icon: FileText },
  { label: "News", path: "/news", icon: Newspaper },
  { label: "Portal", path: "/resident-portal", icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (e, path) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path === "/" ? "/__never__" : path + "/");
    if (isActive) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (location.pathname !== path) {
        navigate(path, { replace: true });
      }
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-card backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch">
        {tabs.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));
          return (
            <Link
              key={path}
              to={path}
              onClick={(e) => handleTabClick(e, path)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium select-none transition-colors
                ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}