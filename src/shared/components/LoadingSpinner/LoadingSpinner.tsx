import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

const BARS = 3;
const BAR_WIDTH = 6;
const BAR_GAP = 10;
const BAR_RADIUS = 2;
const MIN_HEIGHT = 12;
const MAX_HEIGHT = 36;
const DURATION = 0.9;
const STAGGER = 0.15;

export function LoadingSpinner() {
  const controls = Array.from({ length: BARS }, () => useAnimationControls());

  useEffect(() => {
    
    if (!window.__spinnerStart) {
      window.__spinnerStart = Date.now();
    }
    const elapsed = (Date.now() - window.__spinnerStart) / 1000;
    const offset = elapsed % DURATION;

    controls.forEach((ctrl, i) => {
      ctrl.start({
        height: [MIN_HEIGHT, MAX_HEIGHT, MIN_HEIGHT],
        transition: {
          duration: DURATION,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * STAGGER - offset,
        },
      });
    });
  }, [controls]);

  return (
    <output
      data-testid="loading"
      aria-label="Loading"
      className="inline-flex items-end h-[48px]"
    >
      {controls.map((ctrl, i) => (
        <motion.div
          key={i}
          animate={ctrl}
          style={{
            height: MIN_HEIGHT,
            width: BAR_WIDTH,
            borderRadius: BAR_RADIUS,
            backgroundColor: "currentColor",
            marginLeft: i > 0 ? BAR_GAP - BAR_WIDTH : 0,
          }}
        />
      ))}
    </output>
  );
}


declare global {
  interface Window {
    __spinnerStart?: number;
  }
}
