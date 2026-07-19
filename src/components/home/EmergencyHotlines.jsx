import React from "react";
import { Phone, AlertTriangle, Flame, Shield, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function EmergencyHotlines() {
  const { data: settings = [] } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: async () => {
      const res = await base44.functions.invoke('adminSettingsApi', { action: 'list' });
      return res.data || [];
    },
  });

  const getSetting = (key, fallback) =>
    settings.find((s) => s.setting_key === key)?.setting_value || fallback;

  const hotlines = [
    { icon: AlertTriangle, label: "Barangay Emergency", number: getSetting("phone_emergency", "0917-XXX-XXXX"), color: "text-red-500 bg-red-50" },
    { icon: Shield, label: "Police Station", number: getSetting("phone_police", "0917-XXX-XXXX"), color: "text-blue-500 bg-blue-50" },
    { icon: Flame, label: "Fire Department", number: getSetting("phone_fire", "0917-XXX-XXXX"), color: "text-orange-500 bg-orange-50" },
    { icon: Heart, label: "Medical Emergency", number: getSetting("phone_medical", "0917-XXX-XXXX"), color: "text-green-500 bg-green-50" },
  ];

  return (
    <section className="py-12 bg-red-50/50 border-y border-red-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-red-500" />
            Emergency Hotlines
          </h2>
          <p className="text-muted-foreground text-xs">For immediate assistance, call any of these numbers</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {hotlines.map((h) => (
            <a
              key={h.label}
              href={`tel:${h.number}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${h.color} flex items-center justify-center shrink-0`}>
                <h.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{h.label}</p>
                <p className="font-semibold text-sm">{h.number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}