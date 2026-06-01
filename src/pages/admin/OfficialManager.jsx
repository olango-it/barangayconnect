import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const emptyOfficial = { name: "", position: "", photo_url: "", biography: "", contact_info: "", order: 0, is_active: true };

export default function OfficialManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyOfficial);
  const [editId, setEditId] = useState(null);

  const { data: officials = [] } = useQuery({
    queryKey: ["admin-officials"],
    queryFn: () => base44.entities.Official.list("order"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.Official.update(editId, data) : base44.entities.Official.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-officials"] }); toast({ title: editId ? "Official Updated" : "Official Added" }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Official.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-officials"] }); toast({ title: "Official Removed" }); },
  });

  const closeDialog = () => { setDialogOpen(false); setForm(emptyOfficial); setEditId(null); };
  const openEdit = (o) => { setForm(o); setEditId(o.id); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Barangay Officials</h1>
        <Button className="gap-2" onClick={() => { setForm(emptyOfficial); setEditId(null); setDialogOpen(true); }}><Plus className="w-4 h-4" /> Add Official</Button>
      </div>
      {officials.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><User className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No officials added yet.</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officials.map((o) => (
            <div key={o.id} className="bg-card rounded-xl border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {o.photo_url ? (
                    <img src={o.photo_url} alt={o.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"><User className="w-6 h-6 text-muted-foreground" /></div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{o.name}</p>
                    <p className="text-xs text-secondary font-medium">{o.position}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(o)}><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(o.id)} className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Official" : "Add Official"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Position *</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required placeholder="Barangay Captain, Kagawad, etc." /></div>
            <div><Label>Photo URL</Label><Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} /></div>
            <div><Label>Biography</Label><Textarea value={form.biography} onChange={(e) => setForm({ ...form, biography: e.target.value })} /></div>
            <div><Label>Contact Info</Label><Input value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} /></div>
            <div><Label>Display Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Active</Label></div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}