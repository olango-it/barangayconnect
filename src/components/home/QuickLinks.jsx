import React from "react";
import { Link } from "react-router-dom";
import { FileText, Shield, Heart, Briefcase, Users, GraduationCap, Building2, QrCode } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { icon: FileText, label: "Barangay Clearance", path: "/services", color: "bg-blue-50 text-blue-600" },
  { icon: Shield, label: "Certificate of Residency", path: "/services", color: "bg-green-50 text-green-600" },
  { icon: Heart, label: "Certificate of Indigency", path: "/services", color: "bg-red-50 text-red-600" },
  { icon: Briefcase, label: "Business Clearance", path: "/services", color: "bg-amber-50 text-amber-600" },
  { icon: Users, label: "Senior Citizen Cert", path: "/services", color: "bg-purple-50 text-purple-600" },
  { icon: GraduationCap, label: "First Time Job Seeker", path: "/services", color: "bg-indigo-50 text-indigo-600" },
  { icon: Building2, label: "Resident Portal", path: "/resident-portal", color: "bg-teal-50 text-teal-600" },
  { icon: QrCode, label: "Verify Document", path: "/verify", color: "bg-orange-50 text-orange-600" },
];

export default function QuickLinks() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">Quick Links</h2>
          <p className="text-muted-foreground text-sm">Access our most requested services</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={link.path}
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center text-foreground">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}