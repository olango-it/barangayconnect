import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Calendar, Music, Star, Loader2, X } from "lucide-react";

export default function Festival() {
  const [lightbox, setLightbox] = useState(null);

  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ["festival"],
    queryFn: () => base44.entities.Festival.list(),
  });

  const { data: images = [] } = useQuery({
    queryKey: ["festival-images"],
    queryFn: () => base44.entities.FestivalImage.list("order"),
  });

  const festival = festivals[0];
  const activities = festival?.activities
    ? festival.activities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Festival details coming soon.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 sm:h-96 overflow-hidden bg-primary">
        {festival.featured_image && (
          <img src={festival.featured_image} alt={festival.title} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-5xl font-bold text-white drop-shadow-lg"
          >
            {festival.title}
          </motion.h1>
          {festival.subtitle && (
            <p className="text-white/80 mt-2 text-sm sm:text-base">{festival.subtitle}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Quick Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          {festival.patron_saint && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <Star className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Patron Saint</p>
                <p className="text-sm mt-0.5 font-medium">{festival.patron_saint}</p>
              </div>
            </div>
          )}
          {festival.celebration_month && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Celebrated Every</p>
                <p className="text-sm mt-0.5 font-medium">{festival.celebration_month}</p>
              </div>
            </div>
          )}
          {activities.length > 0 && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <Music className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Highlights</p>
                <p className="text-sm mt-0.5 font-medium">{activities.slice(0, 2).join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {festival.description && (
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">About the Festival</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{festival.description}</p>
          </section>
        )}

        {/* History */}
        {festival.history && (
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">History</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm space-y-3">
              {festival.history.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Significance */}
        {festival.significance && (
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold mb-3">Cultural & Religious Significance</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{festival.significance}</p>
          </section>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">Festival Activities</h2>
            <div className="flex flex-wrap gap-2">
              {activities.map((act) => (
                <span key={act} className="bg-secondary/15 text-secondary-foreground text-sm px-4 py-1.5 rounded-full font-medium border border-secondary/30">
                  {act}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl overflow-hidden cursor-pointer aspect-square"
                  onClick={() => setLightbox(img)}
                >
                  <img src={img.image_url} alt={img.caption || "Festival photo"} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.caption} className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            {lightbox.caption && <p className="text-white/70 text-sm text-center mt-3">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}