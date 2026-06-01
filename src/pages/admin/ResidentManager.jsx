import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, Users, Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const emptyResident = {
  first_name: "", middle_name: "", last_name: "", suffix: "",
  date_of_birth: "", gender: "", civil_status: "", address: "",
  purok_sitio: "", contact_number: "", email: "", occupation: "",
  household_number: "", remarks: "", status: "Active",
  photo_url: "", valid_id_front: "", valid_id_back: "",
};

export default function ResidentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyResident);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState({});

  const handleUpload = async (field, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [field]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm((prev) => ({ ...prev, [field]: file_url }));
    setUploading((prev) => ({ ...prev, [field]: false }));
  };

  const { data: residents = [], isLoading } = useQuery({
    queryKey: ["admin-residents"],
    queryFn: () => base44.entities.Resident.list("-created_date", 200),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const fullName = [data.first_name, data.middle_name, data.last_name, data.suffix].filter(Boolean).join(" ");
      const payload = { ...data, full_name: fullName };
      if (editId) return base44.entities.Resident.update(editId, payload);
      return base44.entities.Resident.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-residents"] });
      toast({ title: editId ? "Resident Updated" : "Resident Added" });
      closeDialog();
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyResident);
    setEditId(null);
  };

  const openEdit = (r) => {
    setForm(r);
    setEditId(r.id);
    setDialogOpen(true);
  };

  const filtered = residents.filter((r) =>
    !search || r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.purok_sitio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">Resident Database</h1>
        <Button className="gap-2" onClick={() => { setForm(emptyResident); setEditId(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Resident
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search residents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No residents found.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Purok/Sitio</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Contact</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Gender</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{r.full_name}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{r.purok_sitio || "—"}</td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">{r.contact_number || "—"}</td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">{r.gender || "—"}</td>
                    <td className="p-3"><Badge variant={r.status === "Active" ? "default" : "secondary"}>{r.status}</Badge></td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Edit2 className="w-3 h-3" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Resident" : "Add New Resident"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name *</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required /></div>
              <div><Label>Middle Name</Label><Input value={form.middle_name} onChange={(e) => setForm({ ...form, middle_name: e.target.value })} /></div>
              <div><Label>Last Name *</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required /></div>
              <div><Label>Suffix</Label><Input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} placeholder="Jr., Sr., III" /></div>
              <div><Label>Date of Birth</Label><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              <div><Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Civil Status</Label>
                <Select value={form.civil_status} onValueChange={(v) => setForm({ ...form, civil_status: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Single", "Married", "Widowed", "Separated", "Divorced"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Contact Number</Label><Input value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} /></div>
              <div className="col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>Purok/Sitio</Label><Input value={form.purok_sitio} onChange={(e) => setForm({ ...form, purok_sitio: e.target.value })} /></div>
              <div><Label>Household Number</Label><Input value={form.household_number} onChange={(e) => setForm({ ...form, household_number: e.target.value })} /></div>
              <div><Label>Occupation</Label><Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            {/* Photo Uploads */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
              {[
                { field: "photo_url", label: "2x2 Picture" },
                { field: "valid_id_front", label: "Valid ID (Front)" },
                { field: "valid_id_back", label: "Valid ID (Back)" },
              ].map(({ field, label }) => (
                <div key={field}>
                  <Label>{label}</Label>
                  <div className="mt-1 flex flex-col gap-2">
                    {form[field] && (
                      <img src={form[field]} alt={label} className="w-full h-24 object-cover rounded-lg border" />
                    )}
                    <label className="flex items-center justify-center gap-2 border border-dashed rounded-lg p-3 cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
                      {uploading[field] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading[field] ? "Uploading..." : "Upload"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(field, e.target.files[0])} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div><Label>Remarks</Label><Input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : editId ? "Update" : "Add Resident"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}