import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, Users, FileText, Newspaper, Calendar, Image,
  Building2, Download, Settings, Menu, X, LogOut, ChevronDown,
  Shield, ClipboardList, MessageSquare, Activity, UserCog, HelpCircle, BookOpen, MapPin, Music2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Residents", path: "/admin/residents" },
  { icon: FileText, label: "Certificates", path: "/admin/certificates" },
  { icon: ClipboardList, label: "Requests", path: "/admin/requests" },
  { icon: Newspaper, label: "News", path: "/admin/news" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: Building2, label: "Officials", path: "/admin/officials" },
  { icon: Download, label: "Documents", path: "/admin/documents" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  { icon: UserCog, label: "Staff", path: "/admin/staff" },
  { icon: MessageSquare, label: "Chat Dashboard", path: "/admin/chat" },
  { icon: HelpCircle, label: "FAQ Manager", path: "/admin/faq" },
  { icon: BookOpen, label: "Knowledge Base", path: "/admin/knowledge-base" },
  { icon: Settings, label: "Site Settings", path: "/admin/photos" },
  { icon: MapPin, label: "Tourism", path: "/admin/tourism" },
  { icon: Music2, label: "Festival", path: "/admin/festival" },
];

const staffNavItems = [
  { icon: FileText, label: "Certificates", path: "/admin/certificates" },
  { icon: ClipboardList, label: "Requests", path: "/admin/requests" },
  { icon: Newspaper, label: "Latest News", path: "/admin/news" },
  { icon: Users, label: "Residents", path: "/admin/residents" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pinVerified = sessionStorage.getItem("admin_pin_verified");
    if (pinVerified !== "true") {
      navigate("/admin", { replace: true });
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const adminRole = sessionStorage.getItem("admin_role");
    if (adminRole === "staff") {
      setUser({ full_name: "Staff", role: "staff" });
    } else {
      setUser({ full_name: "Admin", role: "admin" });
    }
    setChecking(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pin_verified");
    sessionStorage.removeItem("admin_role");
    navigate("/admin", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const filteredNav = user?.role === "staff" ? staffNavItems : adminNavItems;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-xs">
              SV
            </div>
            <div>
              <p className="text-xs font-bold">Brgy. San Vicente</p>
              <p className="text-[10px] opacity-60">Admin Panel</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {filteredNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">
              {user?.full_name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.role === "staff" ? "Staff_SanVicente" : "AdminCarlo"}</p>
              <p className="text-[10px] opacity-60 capitalize">{user?.role === "staff" ? "Staff" : "Administrator"}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b h-14 flex items-center px-4 gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="font-heading font-semibold text-sm capitalize">
            {location.pathname.split("/").pop()?.replace(/-/g, " ")}
          </h2>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}