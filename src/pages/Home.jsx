import React from "react";
import HeroBanner from "@/components/home/HeroBanner";
import QuickLinks from "@/components/home/QuickLinks";
import NewsSection from "@/components/home/NewsSection";
import EmergencyHotlines from "@/components/home/EmergencyHotlines";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <QuickLinks />
      <NewsSection />
      <EmergencyHotlines />
    </div>
  );
}