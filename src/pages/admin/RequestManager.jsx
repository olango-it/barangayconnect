import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, FileText, Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

const statusColors = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Released: "bg-purple-100 text-purple-700",
};

export default function RequestManager() {
  const { toast } = useToast();
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => base44.entities.CertificateRequest.list("-created_date", 200),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const updateData = { status };
      if (status === "Approved") updateData.date_approved = new Date().toISOString().split("T")[0];
      if (status === "Released") updateData.date_released = new Date().toISOString().split("T")[0];
      updateData.processing_officer = user?.full_name;
      await base44.entities.CertificateRequest.update(id, updateData);
      await base44.entities.AuditLog.create({
        action: `Request ${status}`,
        details: `Application status changed to ${status}`,
        user_name: user?.full_name,
        user_role: user?.role,
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-requests"] });
      toast({ title: "Status Updated" });
    },
  });

  const filtered = requests.filter((r) => {
    const matchSearch = !search || r.applicant_name?.toLowerCase().includes(search.toLowerCase()) || r.application_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Application Requests</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or app number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {["New", "Pending", "Approved", "Rejected", "Released"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div key={req.id} className="bg-card rounded-xl border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{req.applicant_name}</p>
                    <p className="text-xs text-muted-foreground">{req.document_type} • {req.application_number}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Purpose: {req.purpose}</p>
                    <p className="text-xs text-muted-foreground">Filed: {format(new Date(req.created_date), "MMM d, yyyy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[req.status]}>{req.status}</Badge>
                  <Select
                    value={req.status}
                    onValueChange={(v) => updateMutation.mutate({ id: req.id, status: v })}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["New", "Pending", "Approved", "Rejected", "Released"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}