import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const DEFAULT_HERO = "https://media.base44.com/images/public/6a1d00c12929ea8d18f9682c/51e2c6f70_losbanoshall.jpg";
const PATRON_SAIN_IMG = "https://media.base44.com/images/public/6a1d00c12929ea8d18f9682c/611e02e16_images-removebg-preview.png";

export default function HeroBanner() {
  const { data: settings = [] } = useQuery({
    queryKey: ["admin-photos"],
    queryFn: () => base44.entities.AdminSettings.filter({}),
  });
  const heroPhoto = settings.find((s) => s.setting_key === "photo_hero")?.setting_value || DEFAULT_HERO;

  return (
    <section className="relative min-h-[600px] lg:min-h-[660px] flex items-center overflow-hidden">
      {/* Background Image + Overlays */}
      <div className="absolute inset-0">
        <img src={heroPhoto} alt="Barangay San Vicente" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
      </div>

      {/* Patron Saint Image - behind text, left side */}
      <img
        src={PATRON_SAIN_IMG}
        alt="Patron Saint"
        style={{ maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.25) 100%)", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.25) 100%)" }}
        className="absolute left-4 sm:left-8 lg:left-16 top-2 sm:top-4 lg:top-6 w-48 sm:w-56 lg:w-72 pointer-events-none z-0"
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-medium mb-6">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              Official Government Website
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
              Barangay<br />San Vicente
            </h1>
            <div className="flex items-center gap-2 text-white/80 mb-5">
              <MapPin className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm font-medium">Olango Island, Lapu-Lapu City, Cebu, Philippines</span>
            </div>
            <p className="text-base text-white/75 mb-8 max-w-lg leading-relaxed">
              Serving our community with transparency, integrity, and excellence in public service.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2 shadow-lg shadow-black/20">
                  <FileText className="w-4 h-4" />
                  Our Services
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/resident-portal">
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:text-white gap-2">
                  <Users className="w-4 h-4" />
                  Resident Portal
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Video Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-col gap-4"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md bg-white/10 p-3">
              <div className="rounded-2xl overflow-hidden aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/egas-o4Sk8U?list=RDegas-o4Sk8U"
                  title="Baliw Baliw Festival Official Music Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2 px-2 pt-3 pb-1 text-white/85 text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Baliw Baliw Festival • Official Music Video
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md bg-white/10 p-3">
              <div className="rounded-2xl overflow-hidden aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/RcJAd-mbKuk"
                  title="Barangay San Vicente Hymn"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2 px-2 pt-3 pb-1 text-white/85 text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                Barangay San Vicente Hymn
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}