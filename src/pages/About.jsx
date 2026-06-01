import React from "react";
import { motion } from "framer-motion";
import { Eye, Target, Heart, MapPin, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const values = [
  { icon: Heart, title: "Integrity", desc: "Upholding honesty and strong moral principles in all our actions." },
  { icon: Users, title: "Service", desc: "Putting the welfare of our community above personal interests." },
  { icon: Eye, title: "Transparency", desc: "Ensuring openness and accountability in governance." },
  { icon: Target, title: "Excellence", desc: "Striving for the highest standards in public service delivery." },
];

const DEFAULT_ABOUT = "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&h=400&fit=crop";

export default function About() {
  const { data: settings = [] } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => base44.entities.AdminSettings.filter({}),
  });
  const aboutPhoto = settings.find((s) => s.setting_key === "photo_about")?.setting_value || DEFAULT_ABOUT;

  return (
    <div>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">About Barangay San Vicente</h1>
          <p className="opacity-80 max-w-2xl mx-auto">Learn about our history, vision, and commitment to serving the community of Olango Island.</p>
        </div>
      </section>

      {/* History */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl font-bold mb-4">Our History</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Barangay San Vicente is one of the vibrant communities located in Olango Island, a beautiful coral island in the Cebu Strait, part of the Olango Island Group in Lapu-Lapu City, Cebu, Philippines.</p>
              <p>Our barangay has a rich history rooted in the fishing traditions and cultural heritage of the Visayan people. Over the years, San Vicente has grown into a thriving community while preserving its natural beauty and cultural identity.</p>
              <p>Today, Barangay San Vicente continues to develop its infrastructure, services, and tourism potential while maintaining the close-knit community spirit that defines island life.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src={aboutPhoto}
              alt="Olango Island"
              className="rounded-2xl shadow-lg w-full h-72 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold">Our Vision</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A progressive, peaceful, and self-reliant barangay where every resident enjoys a high quality of life, sustained by good governance, environmental stewardship, and community unity.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold">Our Mission</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To work ahead for the total well-being of populace; to promote progress, through encouragement of their participation and cooperation in a realistic and sustainable socio-cultural, economical, ecological and human development endeavors, and through the collaboration of different NGOs and Civic Organizations towards economical and technological advancement programs with other neighboring barangays.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold text-center mb-10">Core Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-heading font-semibold mb-2">{v.title}</h4>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demographics */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-center mb-10">Barangay Profile</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Population (2024 PSA)", value: "4,370" },
              { icon: MapPin, label: "Area", value: "Olango Island" },
              { icon: Calendar, label: "Established", value: "Barangay" },
              { icon: Target, label: "Puroks", value: "Multiple" },
            ].map((s) => (
              <div key={s.label} className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <s.icon className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}