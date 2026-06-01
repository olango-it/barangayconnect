import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2, Save, ExternalLink } from "lucide-react";

const EMPTY_FESTIVAL = {
  title: "Baliw-Baliw Festival",
  subtitle: "",
  patron_saint: "San Vicente Ferrer",
  celebration_month: "Every May",
  featured_image: "",
  history: "",
  description: "",
  significance: "",
  activities: "",
};

export default function FestivalManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FESTIVAL);
  const [newImage, setNewImage] = useState({ image_url: "", caption: "", order: 0 });

  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ["festival"],
    queryFn: () => base44.entities.Festival.list(),
  });

  const { data: images = [] } = useQuery({
    queryKey: ["festival-images"],
    queryFn: () => base44.entities.FestivalImage.list("order"),
  });

  const festival = festivals[0];

  useEffect(() => {
    if (festival) setForm({ ...EMPTY_FESTIVAL, ...festival });
  }, [festival]);

  const saveMutation = useMutation({
    mutationFn: () =>
      festival
        ? base44.entities.Festival.update(festival.id, form)
        : base44.entities.Festival.create(form),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["festival"] }),
  });

  const addImageMutation = useMutation({
    mutationFn: () => base44.entities.FestivalImage.create(newImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["festival-images"] });
      setNewImage({ image_url: "", caption: "", order: 0 });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id) => base44.entities.FestivalImage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["festival-images"] }),
  });

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Baliw-Baliw Festival Manager</h2>
        <a href="/festival" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" /> Preview Page
          </Button>
        </a>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content & History</TabsTrigger>
          <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Festival Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Subtitle / Tagline</label>
                <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. A celebration of faith and culture" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Patron Saint</label>
                <Input value={form.patron_saint} onChange={(e) => setForm({ ...form, patron_saint: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Celebration Month</label>
                <Input value={form.celebration_month} onChange={(e) => setForm({ ...form, celebration_month: e.target.value })} placeholder="e.g. Every May" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Featured Banner Image URL</label>
              <Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="https://..." />
              {form.featured_image && (
                <img src={form.featured_image} alt="preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">About the Festival</label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="General description of the festival..." />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">History</label>
              <Textarea rows={8} value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} placeholder="Full history of the Baliw-Baliw Festival..." />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Cultural & Religious Significance</label>
              <Textarea rows={4} value={form.significance} onChange={(e) => setForm({ ...form, significance: e.target.value })} placeholder="Explain the cultural and religious significance..." />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Festival Activities (comma-separated)</label>
              <Input value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} placeholder="e.g. Street Dance, Religious Procession, Parade, Cultural Show" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
          {saveMutation.isSuccess && <p className="text-sm text-green-600 text-right">Saved successfully!</p>}
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4 mt-4">
          {/* Add Image */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Add New Photo</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Image URL *</label>
                <Input value={newImage.image_url} onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Caption</label>
                <Input value={newImage.caption} onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })} placeholder="e.g. Street parade 2024" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Display Order</label>
                <Input type="number" value={newImage.order} onChange={(e) => setNewImage({ ...newImage, order: Number(e.target.value) })} className="w-24" />
              </div>
            </div>
            {newImage.image_url && (
              <img src={newImage.image_url} alt="preview" className="h-32 w-full object-cover rounded-lg mt-1" />
            )}
            <Button onClick={() => addImageMutation.mutate()} disabled={addImageMutation.isPending || !newImage.image_url} className="gap-2">
              {addImageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Photo
            </Button>
          </div>

          {/* Existing Images */}
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No photos yet. Add some above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square border">
                  <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {img.caption && <p className="text-white text-xs text-center">{img.caption}</p>}
                    <Button size="sm" variant="destructive" onClick={() => deleteImageMutation.mutate(img.id)}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}