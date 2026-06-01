import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shield, Lock, AlertTriangle, User, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_USERNAME = "AdminCarlo";
const ADMIN_PASSWORD = "553752";
const STAFF_USERNAME = "Staff_SanVicente";
const STAFF_PASSWORD = "KapEdil2025";

export default function AdminGate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState("admin"); // "admin" | "staff"

  // Admin login state
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  // Staff login state
  const [staffUser, setStaffUser] = useState("");
  const [staffPass, setStaffPass] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const adminSession = sessionStorage.getItem("admin_pin_verified");
    if (adminSession === "true") {
      checkUserRole();
    } else {
      setChecking(false);
    }
  }, []);

  const checkUserRole = async () => {
    const pinVerified = sessionStorage.getItem("admin_pin_verified");
    if (pinVerified === "true") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    setChecking(false);
  };

  // --- Admin Login ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (locked) return;

    if (adminUser === ADMIN_USERNAME && adminPass === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_pin_verified", "true");
      sessionStorage.setItem("admin_role", "admin");
      try {
        await base44.entities.AuditLog.create({
          action: "Admin Login",
          details: `Admin login: ${adminUser}`,
          timestamp: new Date().toISOString(),
        });
      } catch {}
      navigate("/admin/dashboard", { replace: true });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      try {
        await base44.entities.AuditLog.create({
          action: "Admin Login Failed",
          details: `Failed admin login attempt #${newAttempts} for: ${adminUser}`,
          timestamp: new Date().toISOString(),
        });
      } catch {}

      if (newAttempts >= 5) {
        setLocked(true);
        toast({ title: "Access Locked", description: "Too many failed attempts. Please wait 5 minutes.", variant: "destructive" });
        setTimeout(() => { setLocked(false); setAttempts(0); }, 300000);
      } else {
        toast({ title: "Access Denied", description: `Incorrect credentials. ${5 - newAttempts} attempts remaining.`, variant: "destructive" });
      }
      setAdminPass("");
    }
  };

  // --- Staff Login ---
  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);

    if (staffUser === STAFF_USERNAME && staffPass === STAFF_PASSWORD) {
      sessionStorage.setItem("admin_pin_verified", "true");
      sessionStorage.setItem("admin_role", "staff");
      try {
        await base44.entities.AuditLog.create({
          action: "Staff Login",
          details: `Staff login: ${staffUser}`,
          timestamp: new Date().toISOString(),
        });
      } catch {}
      navigate("/admin/dashboard", { replace: true });
    } else {
      toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    }
    setLoggingIn(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Authorized Personnel Only</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg border overflow-hidden mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "admin" ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
              onClick={() => setMode("admin")}
            >
              Admin
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "staff" ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
              onClick={() => setMode("staff")}
            >
              Staff
            </button>
          </div>

          {/* Admin Login Mode */}
          {mode === "admin" && (
            <>
              <p className="text-xs text-center text-muted-foreground mb-4">Sign in with your admin credentials</p>
              {locked ? (
                <div className="text-center py-6">
                  <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
                  <p className="text-sm font-medium text-destructive">Account Locked</p>
                  <p className="text-xs text-muted-foreground mt-1">Too many failed attempts. Please wait 5 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      className="pl-10"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Shield className="w-4 h-4" />
                    Sign In as Admin
                  </Button>
                </form>
              )}
            </>
          )}

          {/* Staff Login Mode */}
          {mode === "staff" && (
            <>
              <p className="text-xs text-center text-muted-foreground mb-4">Sign in with your staff credentials</p>
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={staffUser}
                    onChange={(e) => setStaffUser(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={staffPass}
                    onChange={(e) => setStaffPass(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loggingIn}>
                  <KeyRound className="w-4 h-4" />
                  {loggingIn ? "Signing In..." : "Sign In as Staff"}
                </Button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Barangay San Vicente • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}