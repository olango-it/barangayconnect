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
              <p>Barangay San Vicente is one of the island barangays situated on Olango Island under the political jurisdiction of Lapu-Lapu City, Province of Cebu. Before becoming an independent barangay, the area was formerly known as Sitio Poo, a sitio under the jurisdiction of Barangay Santa Rosa. For many years, the community functioned as part of Barangay Santa Rosa, where residents shared social, economic, and cultural ties with neighboring communities on Olango Island.</p>
              
              <p>In 1995, Sitio Poo was officially established as an independent barangay and was named Barangay San Vicente, marking an important milestone in the history of the community. The creation of the barangay paved the way for stronger local governance, improved public services, and greater community participation in development initiatives aimed at uplifting the welfare of its residents.</p>
              
              <p>As part of the Olango Island group, Barangay San Vicente shares a long-standing history rooted in fishing traditions, coastal livelihood, and strong community cooperation that have shaped the identity of its people through generations. Historically, the community relied heavily on fishing, shell gathering, seaweed farming, and small-scale trading as primary sources of livelihood, contributing to the economic and cultural identity of the barangay.</p>
              
              <p>Barangay San Vicente is also known for its distinctive cultural celebration, the Baliw-Baliw Festival, a traditional religious and cultural festivity celebrated annually in honor of San Vicente Ferrer, the patron saint of the barangay. Held every month of May during the barangay fiesta celebration, the festival symbolizes faith, thanksgiving, unity, and cultural identity among residents. According to local tradition, the term "Baliw" is derived from the word "Pabaliw," a cultural expression associated with devotion, festive celebration, and thanksgiving.</p>
              
              <p>Barangay San Vicente is likewise recognized for being home to important ecological and environmental attractions, particularly the Olango Island Wildlife Sanctuary, one of the most significant wetland and migratory bird habitats in the Philippines. The sanctuary was declared a protected wildlife area in 1992 and later recognized as the first Ramsar Wetland Site of International Importance in the Philippines in 1994, emphasizing its global ecological significance.</p>
              
              <p>Another notable environmental asset is the San Vicente Marine Sanctuary, a protected coastal area established to preserve marine biodiversity and promote sustainable use of marine resources. The sanctuary serves as an important area for environmental education, community-based conservation, and livelihood support for fisherfolk and local stakeholders.</p>
              
              <p>Throughout the years, Barangay San Vicente gradually developed into a peaceful coastal community characterized by communal participation, social solidarity, and the preservation of local traditions. In recent years, the barangay has continued to uphold its identity as a vibrant island community while embracing sustainable development and environmental awareness.</p>
              
              <p>Today, Barangay San Vicente stands as a growing and progressive community committed to preserving its cultural heritage, strengthening local governance, promoting sustainable livelihood, and improving the well-being of its people while contributing to the continued growth and development of Olango Island and Lapu-Lapu City.</p>
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
              A community of healthy and happy people; cooperative and participative, yet remains to be self-reliant; living in a peaceful, progressive and environment-friendly neighborhood, that has affected change towards sustainable development in the city.
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