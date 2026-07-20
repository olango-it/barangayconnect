import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, MapPin, Clock, Tag, Lightbulb, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import VirtualMap from "@/components/tourism/VirtualMap";

export default function Tourism() {
  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["tourist-spots-public"],
    queryFn: () => base44.entities.TouristSpot.filter({ is_active: true }, "order"),
  });

  const [selected, setSelected] = useState(null);

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Tourism</h1>
          <p className="opacity-80 max-w-xl mx-auto">Discover the natural beauty and cultural heritage of Olango Island</p>
        </div>
      </section>

      {/* Welcome */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sun className="w-6 h-6 text-secondary" />
            <h2 className="font-heading text-2xl font-bold">Welcome to Olango Island</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Olango Island is a beautiful coral island located in the Cebu Strait, known for its wildlife sanctuary, pristine beaches, and rich marine biodiversity. Just a short boat ride from Mactan, it offers an authentic island experience away from the crowds.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-card rounded-2xl border overflow-hidden animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-6 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : spots.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No tourist spots available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {spots.map((spot, i) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelected(spot)}
                className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  {spot.image_url ? (
                    <img src={spot.image_url} alt={spot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-2">{spot.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{spot.short_description}</p>
                  {spot.location && <p className="text-xs text-muted-foreground mt-2">📍 {spot.location}</p>}
                  <p className="text-xs text-primary font-medium mt-3 group-hover:underline">View full details →</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Virtual Map */}
      <VirtualMap />

      {/* Getting There */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-center mb-8">How to Get Here</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Go to Angasil Port", desc: "Located in Maribago, Lapu-Lapu City, Cebu" },
              { step: "2", title: "Take the Boat", desc: "Regular pump boats depart every 30 minutes. Travel time: ~20 minutes." },
              { step: "3", title: "Arrive at Olango", desc: "Dock at Santa Rosa Port. From there, proceed to San Vicente." },
            ].map((s) => (
              <div key={s.step} className="text-center p-6 bg-card rounded-xl border">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h4 className="font-semibold mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <>
              {selected.image_url && (
                <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="font-heading text-2xl font-bold text-white">{selected.title}</h2>
                    {selected.location && (
                      <div className="flex items-center gap-1 text-white/80 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{selected.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="p-6 space-y-5">
                {!selected.image_url && (
                  <h2 className="font-heading text-2xl font-bold">{selected.title}</h2>
                )}

                <div className="grid sm:grid-cols-3 gap-4">
                  {selected.best_time_to_visit && (
                    <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Time</p>
                        <p className="text-sm mt-0.5">{selected.best_time_to_visit}</p>
                      </div>
                    </div>
                  )}
                  {selected.entrance_fee && (
                    <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
                      <Tag className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entrance Fee</p>
                        <p className="text-sm mt-0.5">{selected.entrance_fee}</p>
                      </div>
                    </div>
                  )}
                  {selected.location && (
                    <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</p>
                        <p className="text-sm mt-0.5">{selected.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selected.full_description && (
                  <div>
                    <h3 className="font-heading text-lg font-bold mb-2">About This Place</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selected.full_description}</p>
                  </div>
                )}

                {selected.short_description && !selected.full_description && (
                  <div>
                    <h3 className="font-heading text-lg font-bold mb-2">About This Place</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selected.short_description}</p>
                  </div>
                )}

                {selected.activities && (
                  <div>
                    <h3 className="font-heading text-lg font-bold mb-2">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.activities.split(",").map((a) => a.trim()).filter(Boolean).map((act) => (
                        <span key={act} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">{act}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.tips && (
                  <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-secondary" />
                      <h3 className="font-heading font-bold">Visitor Tips</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{selected.tips}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}