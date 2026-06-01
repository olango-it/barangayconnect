import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Clock, CheckCircle2, XCircle, LogIn, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const docTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
  "Good Moral Certificate",
  "Solo Parent Certificate",
  "Senior Citizen Certificate",
  "First Time Job Seeker Certificate",
];

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Released: "bg-purple-100 text-purple-700",
};

const statusIcons = {
  New: Clock,
  Pending: Clock,
  Approved: CheckCircle2,
  Rejected: XCircle,
  Released: Package,
};

export default function ResidentPortal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ document_type: "", purpose: "" });

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuth) => {
      if (isAuth) {
        const me = await base44.auth.me();
        setUser(me);
      }
      setAuthChecked(true);
    });
  }, []);

  const { data: requests = [] } = useQuery({
    queryKey: ["my-requests", user?.id],
    queryFn: () => base44.entities.CertificateRequest.filter({ filed_by_resident: true, created_by_id: user.id }, "-created_date"),
    enabled: !!user,
  });

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.CertificateRequest.create({
      ...data,
      applicant_name: user.full_name,
      date_filed: new Date().toISOString().split("T")[0],
      filed_by_resident: true,
      status: "New",
      application_number: `APP-${Date.now().toString(36).toUpperCase()}`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast({ title: "Request Submitted", description: "Your application has been filed." });
      setDialogOpen(false);
      setForm({ document_type: "", purpose: "" });
    },
  });

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Resident Portal</h1>
            <p className="opacity-80">Submit and track your document requests online</p>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <LogIn className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold mb-2">Login Required</h2>
          <p className="text-sm text-muted-foreground mb-6">Please log in or create an account to access the Resident Portal.</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => base44.auth.redirectToLogin()} className="gap-2">
              <LogIn className="w-4 h-4" /> Login to Your Account
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/register"}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">Resident Portal</h1>
              <p className="text-sm opacity-80 mt-1">Welcome, {user.full_name}</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                  <Plus className="w-4 h-4" /> New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Document Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(form); }} className="space-y-4">
                  <div>
                    <Label>Document Type *</Label>
                    <Select value={form.document_type} onValueChange={(v) => setForm({ ...form, document_type: v })}>
                      <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                      <SelectContent>
                        {docTypes.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Purpose *</Label>
                    <Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="State the purpose of your request" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={!form.document_type || submitMutation.isPending}>
                    {submitMutation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-lg font-bold mb-4">My Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>You haven't submitted any requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const StatusIcon = statusIcons[req.status] || Clock;
              return (
                <div key={req.id} className="bg-card rounded-xl border p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{req.document_type}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {req.application_number} • Filed {format(new Date(req.created_date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Purpose: {req.purpose}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[req.status] || "bg-gray-100 text-gray-700"}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {req.status}
                    </Badge>
                  </div>
                  {req.remarks && (
                    <div className="mt-3 pl-13 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <AlertCircle className="w-3 h-3 inline mr-1" /> {req.remarks}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}