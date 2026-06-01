import React from "react";
import { motion } from "framer-motion";
import { Sun, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function Tourism() {
  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["tourist-spots-public"],
    queryFn: () => base44.entities.TouristSpot.filter({ is_active: true }, "order"),
  });

  const handleCardClick = (id) => {
    window.open(`/tourism/${id}`, "_blank");
  };

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
                onClick={() => handleCardClick(spot.id)}
                className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="h-56 overflow-hidden relative">
                  {spot.image_url ? (
                    <img src={spot.image_url} alt={spot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
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
    </div>
  );
}