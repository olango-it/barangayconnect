import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_PIN = "553752";

export default function AdminGate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated and has admin session
    const adminSession = sessionStorage.getItem("admin_pin_verified");
    if (adminSession === "true") {
      checkUserRole();
    } else {
      setChecking(false);
    }
  }, []);

  const checkUserRole = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const user = await base44.auth.me();
      const adminRoles = ["admin", "super_admin", "secretary", "records_officer", "front_desk"];
      if (adminRoles.includes(user.role)) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    }
    setChecking(false);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;

    // Check PIN - first try from settings, fallback to default
    let correctPin = DEFAULT_PIN;
    try {
      const settings = await base44.entities.AdminSettings.filter({ setting_key: "admin_pin" });
      if (settings.length > 0) correctPin = settings[0].setting_value;
    } catch {}

    if (pin === correctPin) {
      sessionStorage.setItem("admin_pin_verified", "true");
      // Log the access attempt
      try {
        await base44.entities.AuditLog.create({
          action: "Admin PIN Verified",
          details: "Successful PIN entry",
          timestamp: new Date().toISOString(),
        });
      } catch {}

      // Check if already logged in as admin
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const user = await base44.auth.me();
        const adminRoles = ["admin", "super_admin", "secretary", "records_officer", "front_desk"];
        if (adminRoles.includes(user.role)) {
          navigate("/admin/dashboard", { replace: true });
          return;
        }
      }
      // Redirect to login
      navigate("/login", { replace: true });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      try {
        await base44.entities.AuditLog.create({
          action: "Admin PIN Failed",
          details: `Failed PIN attempt #${newAttempts}`,
          timestamp: new Date().toISOString(),
        });
      } catch {}

      if (newAttempts >= 5) {
        setLocked(true);
        toast({ title: "Access Locked", description: "Too many failed attempts. Please try again later.", variant: "destructive" });
        setTimeout(() => { setLocked(false); setAttempts(0); }, 300000);
      } else {
        toast({ title: "Access Denied", description: `Incorrect PIN. ${5 - newAttempts} attempts remaining.`, variant: "destructive" });
      }
      setPin("");
    }
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the admin access PIN</p>
          </div>

          {locked ? (
            <div className="text-center py-6">
              <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-sm font-medium text-destructive">Account Locked</p>
              <p className="text-xs text-muted-foreground mt-1">Too many failed attempts. Please wait 5 minutes.</p>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-10 text-center text-lg tracking-[0.5em]"
                  maxLength={10}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Shield className="w-4 h-4" />
                Verify Access
              </Button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Barangay San Vicente • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}