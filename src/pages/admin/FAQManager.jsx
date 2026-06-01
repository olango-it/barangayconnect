import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const categories = ["Barangay Clearance", "Sertipiko sa Pagpuyo", "Sertipiko sa Kawang", "Business Clearance", "Cedula", "Barangay Permits", "Oras sa Opisina", "Kontak", "Mga Opisyal", "Mga Programa", "Emergency", "General"];

const emptyFaq = { question: "", answer: "", category: "General", is_active: true, order: 0 };

export default function FAQManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyFaq);
  const [editId, setEditId] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  const { data: faqs = [] } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: () => base44.entities.FAQ.list("order"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.FAQ.update(editId, data) : base44.entities.FAQ.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-faqs"] }); toast({ title: editId ? "FAQ Updated" : "FAQ Created" }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FAQ.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-faqs"] }); toast({ title: "FAQ Deleted" }); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, val }) => base44.entities.FAQ.update(id, { is_active: val }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });

  const closeDialog = () => { setDialogOpen(false); setForm(emptyFaq); setEditId(null); };
  const openEdit = (f) => { setForm(f); setEditId(f.id); setDialogOpen(true); };

  const filtered = filterCat === "all" ? faqs : faqs.filter(f => f.category === filterCat);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading text-2xl font-bold">FAQ Manager</h1>
        <Button className="gap-2" onClick={() => { setForm(emptyFaq); setEditId(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCat("all")} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filterCat === "all" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filterCat === c ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>Walay FAQ sa kani nga kategorya.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <div key={f.id} className={`bg-card rounded-xl border p-4 ${!f.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{f.category}</Badge>
                    {!f.is_active && <Badge variant="outline" className="text-xs">Disabled</Badge>}
                  </div>
                  <p className="font-medium text-sm">{f.question}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={f.is_active} onCheckedChange={(v) => toggleMutation.mutate({ id: f.id, val: v })} />
                  <Button variant="ghost" size="sm" onClick={() => openEdit(f)}><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(f.id)} className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label>Kategoria *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Pangutana (Question) *</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required placeholder="Unsa ang mga kinahanglanon para sa..." /></div>
            <div><Label>Tubag (Answer) *</Label><Textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required placeholder="Alang sa... palihug pagdala ug..." /></div>
            <div><Label>Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
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