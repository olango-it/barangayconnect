import React from "react";
import { motion } from "framer-motion";
import { Map, ExternalLink } from "lucide-react";

const VIRTUAL_MAP_URL = "http://virtualmap.sanvicente-official.com";

export default function VirtualMap() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl border overflow-hidden shadow-sm"
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-6 h-6 text-secondary" />
                <h2 className="font-heading text-2xl font-bold">Virtual Map</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Explore Barangay San Vicente interactively! Use our virtual map to navigate key locations, tourist spots, government offices, and important landmarks across the barangay.
              </p>
              <a
                href={VIRTUAL_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Open Virtual Map
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="h-64 md:h-full min-h-[250px] bg-primary/10 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop"
                alt="Virtual Map Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <Map className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}