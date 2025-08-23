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

function Bar({ index }: { index: number }) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (!window.__spinnerStart) {
      window.__spinnerStart = Date.now();
    }
    const elapsed = (Date.now() - window.__spinnerStart) / 1000;
    const offset = elapsed % DURATION;

    controls.start({
      height: [MIN_HEIGHT, MAX_HEIGHT, MIN_HEIGHT],
      transition: {
        duration: DURATION,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * STAGGER - offset,
      },
    });
  }, [controls, index]);

  return (
    <motion.div
      animate={controls}
      style={{
        height: MIN_HEIGHT,
        width: BAR_WIDTH,
        borderRadius: BAR_RADIUS,
        backgroundColor: "currentColor",
        marginLeft: index > 0 ? BAR_GAP - BAR_WIDTH : 0,
      }}
    />
  );
}

export function LoadingSpinner() {
  return (
    <output
      data-testid="loading"
      aria-label="Loading"
      className="inline-flex items-end h-[48px]"
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <Bar key={i} index={i} />
      ))}
    </output>
  );
}


declare global {
  interface Window {
    __spinnerStart?: number;
  }
}
