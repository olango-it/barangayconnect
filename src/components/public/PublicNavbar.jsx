import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Officials", path: "/officials" },
  { label: "Services", path: "/services" },
  {
    label: "Information",
    children: [
      { label: "News & Announcements", path: "/news" },
      { label: "Events", path: "/events" },
      { label: "Tourism", path: "/tourism" },
      { label: "Disaster Preparedness", path: "/disaster" },
    ],
  },
  {
    label: "Transparency",
    children: [
      { label: "Transparency Portal", path: "/transparency" },
      { label: "Downloads", path: "/downloads" },
    ],
  },
  { label: "Contact", path: "/contact" },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Emergency: 0917-XXX-XXXX
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/verify" className="hover:underline">Verify Document</Link>
            <span>|</span>
            <Link to="/resident-portal" className="hover:underline">Resident Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">
              SV
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-sm text-primary leading-tight">Barangay San Vicente</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Olango Island, Lapu-Lapu City</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm font-medium gap-1">
                      {link.label}
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.path} asChild>
                        <Link to={child.path} className="w-full">{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm font-medium ${isActive(link.path) ? "bg-primary/10 text-primary" : ""}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            )}
          </nav>

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="block px-6 py-2 text-sm hover:bg-muted rounded-md"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 text-sm rounded-md hover:bg-muted ${isActive(link.path) ? "bg-primary/10 text-primary font-medium" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t space-y-1">
              <Link to="/verify" className="block px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setMobileOpen(false)}>Verify Document</Link>
              <Link to="/resident-portal" className="block px-3 py-2 text-sm hover:bg-muted rounded-md" onClick={() => setMobileOpen(false)}>Resident Portal</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}