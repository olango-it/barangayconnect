import React from "react";
import { RefreshCw } from "lucide-react";

export default function PullToRefreshIndicator({ pulling, pullDistance, threshold = 70 }) {
  if (!pulling && pullDistance === 0) return null;
  const ready = pullDistance >= threshold;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none transition-all"
      style={{ height: Math.min(pullDistance, threshold * 1.5), paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${ready ? "text-primary" : "text-muted-foreground"}`}>
        <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${ready ? "rotate-180 text-primary" : ""}`} />
        {ready ? "Release to refresh" : "Pull to refresh"}
      </div>
    </div>
  );
}