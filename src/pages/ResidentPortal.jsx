import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Clock, CheckCircle2, XCircle, LogIn, AlertCircle, Package, Trash2, LogOut, CreditCard, UserCircle, Pencil, Bell, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MobileSelect from "@/components/ui/MobileSelect";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import ChatWidget from "@/components/chatbot/ChatWidget";
import ResidentIDCard from "@/components/resident/ResidentIDCard";
import ResidentProfileForm from "@/components/resident/ResidentProfileForm";

const docTypes = [
  "Barangay Clearance", "Certificate of Residency", "Certificate of Indigency",
  "Business Clearance", "Good Moral Certificate", "Solo Parent Certificate",
  "Senior Citizen Certificate", "First Time Job Seeker Certificate",
];

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Released: "bg-purple-100 text-purple-700",
};

const statusIcons = { New: Clock, Pending: Clock, Approved: CheckCircle2, Rejected: XCircle, Released: Package };

export default function ResidentPortal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
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

  const { data: resident, isLoading: residentLoading } = useQuery({
    queryKey: ["my-resident-profile", user?.id],
    queryFn: async () => {
      const results = await base44.entities.Resident.filter({ created_by_id: user.id });
      return results[0] || null;
    },
    enabled: !!user,
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["my-requests", user?.id],
    queryFn: () => base44.entities.CertificateRequest.filter({ filed_by_resident: true, created_by_id: user.id }, "-created_date"),
    enabled: !!user,
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["portal-news"],
    queryFn: () => base44.entities.NewsArticle.filter({ is_published: true }, "-publish_date", 3),
    enabled: !!resident,
  });

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ["my-requests", "my-resident-profile"] });
  const { pulling, pullDistance } = usePullToRefresh(handleRefresh);

  const handleLogout = async () => {
    await base44.auth.logout();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    await base44.auth.logout();
    toast({ title: "Account Deletion Requested", description: "Please contact the barangay office to complete removal." });
    setDeleteDialogOpen(false);
  };

  const handleProfileSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["my-resident-profile"] });
    setEditOpen(false);
  };

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.CertificateRequest.create({
      ...data,
      applicant_name: user.full_name,
      date_filed: new Date().toISOString().split("T")[0],
      filed_by_resident: true,
      status: "New",
      application_number: `APP-${Date.now().toString(36).toUpperCase()}`,
    }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["my-requests", user?.id] });
      const previous = queryClient.getQueryData(["my-requests", user?.id]);
      const optimistic = {
        id: `optimistic-${Date.now()}`, document_type: data.document_type, purpose: data.purpose,
        applicant_name: user.full_name, status: "New",
        application_number: `APP-${Date.now().toString(36).toUpperCase()}`,
        created_date: new Date().toISOString(), filed_by_resident: true,
      };
      queryClient.setQueryData(["my-requests", user?.id], (old = []) => [optimistic, ...old]);
      setDialogOpen(false);
      setForm({ document_type: "", purpose: "" });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
      toast({ title: "Request Submitted", description: "Your application has been filed." });
    },
    onError: (_err, _data, context) => {
      if (context?.previous) queryClient.setQueryData(["my-requests", user?.id], context.previous);
      toast({ title: "Failed to submit", description: "Please try again.", variant: "destructive" });
    },
  });

  if (!authChecked || (!!user && residentLoading)) {
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
            <p className="opacity-80">Register your account, get your Resident ID, and access barangay services online</p>
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
            <Button variant="outline" onClick={() => (window.location.href = "/register")}>Create Account</Button>
          </div>
        </div>
      </div>
    );
  }

  // No resident profile yet → show profile form
  if (!resident) {
    return (
      <div>
        <PullToRefreshIndicator pulling={pulling} pullDistance={pullDistance} />
        <section className="bg-primary text-primary-foreground py-10">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="font-heading text-2xl font-bold">Complete Your Resident Profile</h1>
            <p className="text-sm opacity-80 mt-1">Fill out the form below to get your unique Resident ID and digital ID card.</p>
          </div>
        </section>
        <section className="py-8 max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-xl border p-6">
            <ResidentProfileForm user={user} onSaved={handleProfileSaved} />
          </div>
        </section>
        <ChatWidget />
      </div>
    );
  }

  // Dashboard
  const pendingCount = requests.filter((r) => r.status === "New" || r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved" || r.status === "Released").length;

  return (
    <div>
      <PullToRefreshIndicator pulling={pulling} pullDistance={pullDistance} />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {resident.photo_url ? (
                <img src={resident.photo_url} alt={resident.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCircle className="w-10 h-10" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-xl font-bold">{resident.full_name}</h1>
                <p className="text-sm opacity-80 mt-0.5">
                  {resident.resident_id} • {resident.status || "Active"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-white/30 text-white bg-white/5 hover:bg-white/15 gap-2" onClick={() => setLogoutOpen(true)}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3" onClick={() => setIdCardOpen(true)}>
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-xs">View Resident ID</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3" onClick={() => setEditOpen(true)}>
            <Pencil className="w-5 h-5 text-primary" />
            <span className="text-xs">Edit Profile</span>
          </Button>
          <Link to="/resident-portal/profile" className="w-full">
            <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3 w-full">
              <UserCircle className="w-5 h-5 text-primary" />
              <span className="text-xs">Full Profile</span>
            </Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3 w-full">
                <Plus className="w-5 h-5 text-primary" />
                <span className="text-xs">New Request</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Submit Document Request</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(form); }} className="space-y-4">
                <div>
                  <Label>Document Type *</Label>
                  <MobileSelect value={form.document_type} onValueChange={(v) => setForm({ ...form, document_type: v })} placeholder="Select document type" options={docTypes.map((d) => ({ value: d, label: d }))} />
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
      </section>

      {/* Stats */}
      <section className="py-2 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{requests.length}</p>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
        </div>
      </section>

      {/* ID Card Preview */}
      <section className="py-6 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-lg font-bold mb-4">Digital Resident ID</h2>
        <div className="max-w-sm">
          <ResidentIDCard resident={resident} showActions={false} />
        </div>
      </section>

      {/* My Requests */}
      <section className="py-6 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-lg font-bold mb-4">My Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>You haven't submitted any requests yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const StatusIcon = statusIcons[req.status] || Clock;
              return (
                <div key={req.id} className="bg-card rounded-xl border p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{req.document_type}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{req.application_number} • Filed {format(new Date(req.created_date), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground mt-1">Purpose: {req.purpose}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[req.status] || "bg-gray-100 text-gray-700"}>
                      <StatusIcon className="w-3 h-3 mr-1" />{req.status}
                    </Badge>
                  </div>
                  {req.remarks && (
                    <div className="mt-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <AlertCircle className="w-3 h-3 inline mr-1" /> {req.remarks}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="py-6 max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />Announcements</h2>
          <div className="space-y-3">
            {announcements.map((news) => (
              <Link key={news.id} to={`/news/${news.id}`} className="block bg-card rounded-xl border p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <Newspaper className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">{news.title}</h3>
                    {news.excerpt && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.excerpt}</p>}
                    {news.publish_date && <p className="text-xs text-muted-foreground mt-1">{format(new Date(news.publish_date), "MMM d, yyyy")}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Settings */}
      <section className="py-6 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-lg font-bold mb-4">Settings</h2>
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account and all associated data.</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          </div>
        </div>
      </section>

      {/* Logout Confirmation */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Logout</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to log out of your account?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="gap-2" onClick={handleLogout}><LogOut className="w-4 h-4" /> Logout</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <ResidentProfileForm user={user} existing={resident} onSaved={handleProfileSaved} />
        </DialogContent>
      </Dialog>

      {/* ID Card Dialog */}
      <Dialog open={idCardOpen} onOpenChange={setIdCardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Your Resident ID</DialogTitle></DialogHeader>
          <ResidentIDCard resident={resident} showActions={false} />
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-destructive">Delete Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This action cannot be undone. To confirm, type <strong>DELETE</strong> below.</p>
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE to confirm" />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleteConfirm(""); }}>Cancel</Button>
              <Button variant="destructive" disabled={deleteConfirm !== "DELETE"} onClick={handleDeleteAccount}>Confirm Delete</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChatWidget />
    </div>
  );
}