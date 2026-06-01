import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MapPin, Clock, Tag, Lightbulb, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TourismDetail() {
  const { id } = useParams();

  const { data: spot, isLoading } = useQuery({
    queryKey: ["tourist-spot", id],
    queryFn: () => base44.entities.TouristSpot.filter({ id }),
    select: (data) => data[0],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Tourist spot not found.</p>
        <Link to="/tourism"><Button variant="outline">Back to Tourism</Button></Link>
      </div>
    );
  }

  const activities = spot.activities
    ? spot.activities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      {spot.image_url && (
        <div className="relative h-64 sm:h-96 w-full overflow-hidden">
          <img src={spot.image_url} alt={spot.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-white">{spot.title}</h1>
            {spot.location && (
              <div className="flex items-center gap-1 text-white/80 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{spot.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Back link */}
        <Link to="/tourism" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Tourism
        </Link>

        {!spot.image_url && (
          <h1 className="font-heading text-3xl font-bold">{spot.title}</h1>
        )}

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {spot.best_time_to_visit && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Best Time to Visit</p>
                <p className="text-sm mt-0.5">{spot.best_time_to_visit}</p>
              </div>
            </div>
          )}
          {spot.entrance_fee && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <Tag className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entrance Fee</p>
                <p className="text-sm mt-0.5">{spot.entrance_fee}</p>
              </div>
            </div>
          )}
          {spot.location && (
            <div className="bg-card border rounded-xl p-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</p>
                <p className="text-sm mt-0.5">{spot.location}</p>
              </div>
            </div>
          )}
        </div>

        {/* Full Description */}
        {spot.full_description && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-heading text-xl font-bold mb-3">About This Place</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {spot.full_description}
            </div>
          </motion.div>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-3">Activities</h2>
            <div className="flex flex-wrap gap-2">
              {activities.map((act) => (
                <span key={act} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
                  {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {spot.tips && (
          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-secondary" />
              <h2 className="font-heading text-lg font-bold">Visitor Tips</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{spot.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}