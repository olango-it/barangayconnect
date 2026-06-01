import React from "react";
import { Users, MapPin, Home, Calendar } from "lucide-react";

const stats = [
  { icon: Users, label: "Population (PSA 2024)", value: "4,370", sub: "2024 Census of Population" },
  { icon: Home, label: "Households", value: "1,492", sub: "Census of Population" },
  { icon: MapPin, label: "Location", value: "Olango Island", sub: "Lapu-Lapu City, Cebu" },
  { icon: Calendar, label: "Census Year", value: "2024", sub: "Philippine Statistics Authority" },
];

export default function BarangayStats() {
  return (
    <section className="bg-muted/40 border-b border-border py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4 bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}