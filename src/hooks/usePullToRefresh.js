import { useEffect, useRef, useState } from "react";

export default function usePullToRefresh(onRefresh, threshold = 70) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(null);

  useEffect(() => {
    const el = document.documentElement;

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const dist = e.touches[0].clientY - startY.current;
      if (dist > 0 && el.scrollTop === 0) {
        setPullDistance(Math.min(dist, threshold * 1.5));
        if (dist > 10) setPulling(true);
      }
    };

    const onTouchEnd = () => {
      if (pullDistance >= threshold) {
        onRefresh();
      }
      startY.current = null;
      setPulling(false);
      setPullDistance(0);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, pullDistance, threshold]);

  return { pulling, pullDistance };
}