import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import BottomNav from "./BottomNav";
import BackToTop from "./BackToTop";
import ChatWidget from "@/components/chatbot/ChatWidget";

// Apply dark mode based on system preference
if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Desktop footer only */}
      <div className="hidden lg:block">
        <PublicFooter />
      </div>
      <BottomNav />
      <BackToTop />
      <ChatWidget />
    </div>
  );
}