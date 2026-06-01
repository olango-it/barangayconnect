import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, FileText, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const categories = ["Form", "Report", "Ordinance", "Resolution", "Budget", "Financial Statement", "Procurement", "Development Plan", "Citizens Charter", "Other"];
const emptyDoc = { title: "", category: "Form", file_url: "", description: "", is_public: true };

export default function DocumentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyDoc);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: docs = [] } = useQuery({
    queryKey: ["admin-docs"],
    queryFn: () => base44.entities.Document.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.Document.update(editId, data) : base44.entities.Document.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-docs"] }); toast({ title: editId ? "Document Updated" : "Document Added" }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-docs"] }); toast({ title: "Document Deleted" }); },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, file_url });
    setUploading(false);
  };

  const closeDialog = () => { setDialogOpen(false); setForm(emptyDoc); setEditId(null); };
  const openEdit = (d) => { setForm(d); setEditId(d.id); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Documents</h1>
        <Button className="gap-2" onClick={() => { setForm(emptyDoc); setEditId(null); setDialogOpen(true); }}><Plus className="w-4 h-4" /> Add Document</Button>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No documents yet.</p></div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="bg-card rounded-xl border p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-sm">{d.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{d.category}</Badge>
                    <Badge variant={d.is_public ? "default" : "outline"} className="text-xs">{d.is_public ? "Public" : "Private"}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(d)}><Edit2 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(d.id)} className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Document" : "Add Document"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div>
              <Label>File</Label>
              <div className="flex gap-2">
                <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="File URL" className="flex-1" />
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                  <Button type="button" variant="outline" size="icon" asChild disabled={uploading}>
                    <span><Upload className="w-4 h-4" /></span>
                  </Button>
                </label>
              </div>
              {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_public} onCheckedChange={(v) => setForm({ ...form, is_public: v })} /><Label>Public</Label></div>
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