import React from "react";
import HeroBanner from "@/components/home/HeroBanner";
import WeatherWidget from "@/components/home/WeatherWidget";
import QuickLinks from "@/components/home/QuickLinks";
import NewsSection from "@/components/home/NewsSection";
import EmergencyHotlines from "@/components/home/EmergencyHotlines";
import BarangayStats from "@/components/home/BarangayStats";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <WeatherWidget />
      <BarangayStats />
      <QuickLinks />
      <NewsSection />
      <EmergencyHotlines />
    </div>
  );
}