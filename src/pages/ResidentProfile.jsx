import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, FileText, Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import ResidentIDCard from "@/components/resident/ResidentIDCard";
import ResidentProfileForm from "@/components/resident/ResidentProfileForm";
import ChatWidget from "@/components/chatbot/ChatWidget";

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Released: "bg-purple-100 text-purple-700",
};

const statusIcons = { New: Clock, Pending: Clock, Approved: CheckCircle2, Rejected: XCircle, Released: Package };

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground sm:w-40 shrink-0">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function ResidentProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuth) => {
      if (isAuth) {
        const me = await base44.auth.me();
        setUser(me);
      }
      setAuthChecked(true);
    });
  }, []);

  const { data: resident, isLoading } = useQuery({
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
    enabled: !!resident,
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["my-resident-profile"] });
    setEditOpen(false);
    toast({ title: "Profile updated successfully" });
  };

  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !resident) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Resident profile not found.</p>
        <Link to="/resident-portal"><Button>Back to Portal</Button></Link>
      </div>
    );
  }

  return (
    <div className="pb-16 lg:pb-0">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/resident-portal" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold">My Profile</h1>
              <p className="text-sm opacity-80 mt-1">{resident.resident_id} • {resident.status || "Active"}</p>
            </div>
            <Button variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white/15 gap-2" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Photo + Basic Info */}
        <div className="bg-card rounded-xl border p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {resident.photo_url ? (
            <img src={resident.photo_url} alt={resident.full_name} className="w-28 h-32 rounded-xl object-cover border border-border" />
          ) : (
            <div className="w-28 h-32 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-heading text-xl font-bold">{resident.full_name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{resident.occupation || "—"}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Badge className={resident.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {resident.status || "Active"}
              </Badge>
              <Badge variant="outline">{resident.voter_status || "Voter status not set"}</Badge>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Personal Information</h3>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Resident ID" value={resident.resident_id} />
            <InfoRow label="Date Registered" value={resident.created_date ? format(new Date(resident.created_date), "MMM d, yyyy") : "—"} />
            <InfoRow label="First Name" value={resident.first_name} />
            <InfoRow label="Last Name" value={resident.last_name} />
            <InfoRow label="Middle Name" value={resident.middle_name} />
            <InfoRow label="Suffix" value={resident.suffix} />
            <InfoRow label="Birth Date" value={resident.date_of_birth ? format(new Date(resident.date_of_birth), "MMM d, yyyy") : "—"} />
            <InfoRow label="Age" value={resident.age} />
            <InfoRow label="Sex" value={resident.gender} />
            <InfoRow label="Civil Status" value={resident.civil_status} />
            <InfoRow label="Nationality" value={resident.nationality} />
          </div>
        </div>

        {/* Address */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Address</h3>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Complete Address" value={resident.address} />
            <InfoRow label="Purok / Sitio" value={resident.purok_sitio} />
            <InfoRow label="Barangay" value={resident.barangay} />
            <InfoRow label="Municipality / City" value={resident.municipality} />
            <InfoRow label="Province" value={resident.province} />
            <InfoRow label="Household No." value={resident.household_number} />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-x-8">
            <InfoRow label="Contact Number" value={resident.contact_number} />
            <InfoRow label="Email Address" value={resident.email} />
            <InfoRow label="Occupation" value={resident.occupation} />
            <InfoRow label="Emergency Contact" value={resident.emergency_contact} />
          </div>
        </div>

        {/* Digital ID Card */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Digital Resident ID Card</h3>
          <div className="max-w-sm mx-auto">
            <ResidentIDCard resident={resident} />
          </div>
        </div>

        {/* Certificate Requests */}
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-heading text-lg font-bold mb-4">Certificate Requests</h3>
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No certificate requests yet.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => {
                const StatusIcon = statusIcons[req.status] || Clock;
                return (
                  <div key={req.id} className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{req.document_type}</p>
                        <p className="text-xs text-muted-foreground">{req.application_number} • {format(new Date(req.created_date), "MMM d, yyyy")}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[req.status] || "bg-gray-100 text-gray-700"}>
                      <StatusIcon className="w-3 h-3 mr-1" />{req.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <ResidentProfileForm user={user} existing={resident} onSaved={handleSaved} />
        </DialogContent>
      </Dialog>

      <ChatWidget />
    </div>
  );
}