import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, BookOpen, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const categories = ["Policy", "Procedure", "Requirements", "Announcement", "Event", "General"];
const empty = { title: "", content: "", category: "General", is_active: true };

export default function KnowledgeBaseManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["admin-kb"],
    queryFn: () => base44.entities.KnowledgeBase.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.KnowledgeBase.update(editId, data) : base44.entities.KnowledgeBase.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-kb"] }); toast({ title: editId ? "Updated" : "Added" }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBase.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-kb"] }); toast({ title: "Deleted" }); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, val }) => base44.entities.KnowledgeBase.update(id, { is_active: val }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-kb"] }),
  });

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExtracting(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } } }
    });
    if (result.status === "success" && result.output) {
      setForm(prev => ({ ...prev, title: result.output.title || file.name, content: result.output.content || "" }));
    }
    setExtracting(false);
  };

  const closeDialog = () => { setDialogOpen(false); setForm(empty); setEditId(null); };
  const openEdit = (k) => { setForm(k); setEditId(k.id); setDialogOpen(true); };

  const catColors = { Policy: "bg-blue-100 text-blue-700", Procedure: "bg-purple-100 text-purple-700", Requirements: "bg-orange-100 text-orange-700", Announcement: "bg-yellow-100 text-yellow-700", Event: "bg-green-100 text-green-700", General: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">AI training data — policies, procedures, requirements</p>
        </div>
        <Button className="gap-2" onClick={() => { setForm(empty); setEditId(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Entry
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No knowledge base entries yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((k) => (
            <div key={k.id} className={`bg-card rounded-xl border p-4 ${!k.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColors[k.category] || "bg-gray-100 text-gray-700"}`}>{k.category}</span>
                    {!k.is_active && <Badge variant="outline" className="text-xs">Disabled</Badge>}
                  </div>
                  <p className="font-medium text-sm">{k.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{k.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={k.is_active} onCheckedChange={(v) => toggleMutation.mutate({ id: k.id, val: v })} />
                  <Button variant="ghost" size="sm" onClick={() => openEdit(k)}><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(k.id)} className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editId ? "Edit Entry" : "Add Knowledge Base Entry"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            {/* PDF Upload */}
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-2">Upload PDF to auto-extract content</p>
              <label className="cursor-pointer">
                <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                <Button type="button" variant="outline" size="sm" disabled={extracting} asChild>
                  <span>{extracting ? "Extracting..." : "Upload PDF"}</span>
                </Button>
              </label>
            </div>
            <div><Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label>Content *</Label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required placeholder="Isulat ang impormasyon nga gamiton sa chatbot..." /></div>
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