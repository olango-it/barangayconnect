import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Eye, X, Loader2 } from "lucide-react";

const EMPTY_SPOT = {
  title: "",
  short_description: "",
  full_description: "",
  image_url: "",
  location: "",
  best_time_to_visit: "",
  entrance_fee: "",
  activities: "",
  tips: "",
  order: 0,
  is_active: true,
};

export default function TourismManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = list view, object = form
  const [isNew, setIsNew] = useState(false);

  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["tourist-spots"],
    queryFn: () => base44.entities.TouristSpot.list("order"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.TouristSpot.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tourist-spots"] }); setEditing(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TouristSpot.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tourist-spots"] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TouristSpot.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tourist-spots"] }),
  });

  const handleSave = () => {
    if (isNew) {
      createMutation.mutate(editing);
    } else {
      updateMutation.mutate({ id: editing.id, data: editing });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (editing) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">{isNew ? "Add Tourist Spot" : "Edit Tourist Spot"}</h2>
          <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="w-4 h-4" /></Button>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Title *</label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Olango Island Wildlife Sanctuary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="e.g. Barangay San Vicente, Olango Island" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Main Image URL</label>
            <Input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
            {editing.image_url && (
              <img src={editing.image_url} alt="preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Short Description (shown on card)</label>
            <Textarea rows={2} value={editing.short_description} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} placeholder="Brief summary shown in the tourism listing..." />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Full Description (shown on detail page)</label>
            <Textarea rows={6} value={editing.full_description} onChange={(e) => setEditing({ ...editing, full_description: e.target.value })} placeholder="Detailed information about this tourist spot..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Best Time to Visit</label>
              <Input value={editing.best_time_to_visit} onChange={(e) => setEditing({ ...editing, best_time_to_visit: e.target.value })} placeholder="e.g. November to April" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Entrance Fee</label>
              <Input value={editing.entrance_fee} onChange={(e) => setEditing({ ...editing, entrance_fee: e.target.value })} placeholder="e.g. ₱50 per person / Free" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Activities (comma-separated)</label>
            <Input value={editing.activities} onChange={(e) => setEditing({ ...editing, activities: e.target.value })} placeholder="e.g. Birdwatching, Swimming, Snorkeling" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Visitor Tips</label>
            <Textarea rows={3} value={editing.tips} onChange={(e) => setEditing({ ...editing, tips: e.target.value })} placeholder="Tips and reminders for visitors..." />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Display Order</label>
            <Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="w-24" />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving || !editing.title}>
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? "Create Spot" : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Tourism Manager</h2>
        <Button onClick={() => { setEditing({ ...EMPTY_SPOT }); setIsNew(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Tourist Spot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : spots.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No tourist spots yet.</p>
          <Button className="mt-4 gap-2" onClick={() => { setEditing({ ...EMPTY_SPOT }); setIsNew(true); }}>
            <Plus className="w-4 h-4" /> Add First Spot
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {spots.map((spot) => (
            <div key={spot.id} className="bg-card border rounded-xl overflow-hidden flex gap-0">
              {spot.image_url && (
                <img src={spot.image_url} alt={spot.title} className="w-32 h-full object-cover shrink-0 hidden sm:block" style={{ maxHeight: 100 }} />
              )}
              <div className="flex-1 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{spot.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{spot.short_description}</p>
                  {spot.location && <p className="text-xs text-muted-foreground mt-0.5">📍 {spot.location}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/tourism/${spot.id}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" title="Preview"><Eye className="w-4 h-4" /></Button>
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...spot }); setIsNew(false); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(spot.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}