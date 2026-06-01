import React from "react";
import { AlertTriangle, Phone, MapPin, BookOpen, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const DEFAULT_CONTACTS = [
  { name: "Barangay Emergency Hotline", number: "0917-XXX-XXXX" },
  { name: "Municipal DRRMO", number: "0917-XXX-XXXX" },
  { name: "PNP Lapu-Lapu", number: "(032) XXX-XXXX" },
  { name: "BFP Lapu-Lapu", number: "(032) XXX-XXXX" },
  { name: "Red Cross Cebu", number: "(032) 253-6525" },
  { name: "National Emergency Hotline", number: "911" },
];

const DEFAULT_CENTERS = [
  "San Vicente Elementary School",
  "Barangay Hall",
  "San Vicente Chapel",
];

const DEFAULT_GUIDES = [
  { title: "Typhoon Preparedness", items: ["Secure your home and roof", "Store food and water for 3 days", "Keep flashlights and batteries ready", "Know your evacuation route", "Listen to official announcements"] },
  { title: "Earthquake Safety", items: ["Drop, Cover, and Hold On", "Stay away from glass and heavy objects", "Move to open area after shaking stops", "Check for injuries and damage", "Be prepared for aftershocks"] },
  { title: "Flood Preparedness", items: ["Know your area's flood risk", "Move to higher ground when warned", "Never walk through floodwaters", "Secure important documents", "Have emergency supplies ready"] },
];

function parseSetting(settings, key, def) {
  const s = settings.find((s) => s.setting_key === key);
  try { return s ? JSON.parse(s.setting_value) : def; }
  catch { return def; }
}

export default function Disaster() {
  const { data: settings = [] } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => base44.entities.AdminSettings.filter({}),
  });

  const contacts = parseSetting(settings, "disaster_contacts", DEFAULT_CONTACTS);
  const centers = parseSetting(settings, "disaster_centers", DEFAULT_CENTERS);
  const guides = parseSetting(settings, "disaster_guides", DEFAULT_GUIDES);

  return (
    <div>
      <section className="bg-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Disaster Preparedness</h1>
          <p className="opacity-80">Emergency contacts, evacuation information, and preparedness guides</p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-500" /> Emergency Contacts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={`tel:${c.number}`}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-sm text-primary font-semibold">{c.number}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Evacuation Centers */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> Evacuation Centers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {centers.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                <Shield className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparedness Guides */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" /> Preparedness Guides
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((g, gi) => (
            <div key={gi} className="bg-card rounded-xl border p-6">
              <h3 className="font-heading font-semibold text-lg mb-4">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}