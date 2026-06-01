import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const emptyEvent = { title: "", description: "", category: "General", event_date: "", start_time: "", end_time: "", location: "", is_published: true };

export default function EventManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [editId, setEditId] = useState(null);

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => base44.entities.Event.list("-event_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editId ? base44.entities.Event.update(editId, data) : base44.entities.Event.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: editId ? "Event Updated" : "Event Created" }); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Event.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: "Event Deleted" }); },
  });

  const closeDialog = () => { setDialogOpen(false); setForm(emptyEvent); setEditId(null); };
  const openEdit = (e) => { setForm(e); setEditId(e.id); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Events</h1>
        <Button className="gap-2" onClick={() => { setForm(emptyEvent); setEditId(null); setDialogOpen(true); }}><Plus className="w-4 h-4" /> New Event</Button>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground"><Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" /><p>No events yet.</p></div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="bg-card rounded-xl border p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{e.title}</h3>
                <p className="text-xs text-muted-foreground">{e.category} • {e.event_date ? format(new Date(e.event_date), "MMM d, yyyy") : "TBD"} {e.start_time && `• ${e.start_time}`}</p>
                {e.location && <p className="text-xs text-muted-foreground">{e.location}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(e)}><Edit2 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(e.id)} className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit Event" : "New Event"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Community Activity", "Meeting", "Health Program", "Sports", "Festival", "General"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Date *</Label><Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required /></div>
              <div><Label>Start</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
              <div><Label>End</Label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
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