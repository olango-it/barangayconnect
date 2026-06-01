import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";

export default function Officials() {
  const { data: officials = [] } = useQuery({
    queryKey: ["officials"],
    queryFn: () => base44.entities.Official.filter({ is_active: true }, "order"),
  });

  return (
    <div>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Barangay Officials</h1>
          <p className="opacity-80">Meet the dedicated leaders serving Barangay San Vicente</p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        {officials.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Official profiles will be displayed here.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {officials.map((official, i) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-56 bg-muted flex items-center justify-center overflow-hidden">
                  {official.photo_url ? (
                    <img
                      src={official.photo_url}
                      alt={official.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
                    {official.position}
                  </p>
                  <h3 className="font-heading text-lg font-bold mb-2">{official.name}</h3>
                  {official.biography && (
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{official.biography}</p>
                  )}
                  {official.contact_info && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {official.contact_info}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}