import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-6">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Official Government Website
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Barangay San Vicente
            </h1>
            <p className="text-lg opacity-90 mb-2">Olango Island, Lapu-Lapu City, Cebu, Philippines</p>
            <p className="text-sm opacity-70 mb-8 max-w-lg leading-relaxed">
              Welcome to the official website of Barangay San Vicente. We are committed to serving our community with transparency, integrity, and excellence in public service.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2">
                  <FileText className="w-4 h-4" />
                  Our Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/resident-portal">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                  <Users className="w-4 h-4" />
                  Resident Portal
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=600&h=400&fit=crop"
                alt="Barangay San Vicente Community"
                className="rounded-2xl shadow-2xl w-full object-cover h-80"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-foreground p-4 rounded-xl shadow-lg">
                <p className="text-2xl font-bold text-primary">10,000+</p>
                <p className="text-xs text-muted-foreground">Residents Served</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}