import React from "react";
import { motion } from "framer-motion";
import { MapPin, Fish, Waves, Camera, Sun } from "lucide-react";

const attractions = [
  {
    title: "Olango Island Wildlife Sanctuary",
    desc: "A protected area and Ramsar Wetland Site, home to migratory birds from Siberia, China, and Japan. One of the best birdwatching destinations in the Philippines.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    icon: Fish,
  },
  {
    title: "Beautiful Beaches",
    desc: "Pristine white sand beaches with crystal clear waters perfect for swimming, snorkeling, and relaxation.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    icon: Waves,
  },
  {
    title: "Marine Sanctuaries",
    desc: "Protected marine areas with diverse coral reefs and marine life ideal for diving and eco-tourism.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    icon: Fish,
  },
  {
    title: "Local Culture & Heritage",
    desc: "Experience the rich Visayan culture, local festivals, traditional fishing practices, and warm island hospitality.",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=400&fit=crop",
    icon: Camera,
  },
];

export default function Tourism() {
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

        <div className="grid md:grid-cols-2 gap-8">
          {attractions.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="h-56 overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <a.icon className="w-5 h-5 text-secondary" />
                  <h3 className="font-heading font-bold text-lg">{a.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
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