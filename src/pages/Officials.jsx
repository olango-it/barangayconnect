import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, X } from "lucide-react";

export default function Officials() {
  const [selected, setSelected] = useState(null);

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
          <>
            {/* Barangay Officials */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-center mb-8 text-primary">Barangay Officials</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {officials.filter((o) => !o.position?.toLowerCase().includes("sk")).map((official, i) => (
                  <motion.div
                    key={official.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div
                      className="h-56 bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={() => setSelected(official)}
                    >
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
            </div>

            {/* SK Officials */}
            {officials.some((o) => o.position?.toLowerCase().includes("sk")) && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="font-heading text-2xl font-bold text-primary">Sangguniang Kabataan (SK) Officials</h2>
                  <p className="text-sm text-muted-foreground mt-1">Youth leaders of Barangay San Vicente</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {officials.filter((o) => o.position?.toLowerCase().includes("sk")).map((official, i) => (
                    <motion.div
                      key={official.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div
                        className="h-56 bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => setSelected(official)}
                      >
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
              </div>
            )}
          </>
        )}
      </section>

      {/* Official Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-card rounded-2xl overflow-hidden shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo */}
              <div className="h-72 bg-muted flex items-center justify-center overflow-hidden relative">
                {selected.photo_url ? (
                  <img
                    src={selected.photo_url}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-20 h-20 text-muted-foreground/30" />
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details */}
              <div className="p-6">
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">
                  {selected.position}
                </p>
                <h2 className="font-heading text-2xl font-bold mb-3">{selected.name}</h2>

                {selected.biography && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Biography</p>
                    <p className="text-sm leading-relaxed">{selected.biography}</p>
                  </div>
                )}

                {selected.contact_info && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{selected.contact_info}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}