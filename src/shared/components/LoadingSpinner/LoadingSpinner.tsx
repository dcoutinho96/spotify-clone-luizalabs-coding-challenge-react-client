import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

const BAR_WIDTH = 6;
const BAR_GAP = 10;
const BAR_RADIUS = 2;
const MIN_HEIGHT = 12;
const MAX_HEIGHT = 36;
const DURATION = 0.9;
const STAGGER = 0.15;

interface BarProps {
  readonly id: string;
  readonly index: number;
}

function Bar({ id, index }: BarProps) {
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
      key={id}
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
  const barIds = ["bar-a", "bar-b", "bar-c"]; 

  return (
    <output
      data-testid="loading"
      aria-label="Loading"
      className="inline-flex items-end h-[48px]"
    >
      {barIds.map((id, i) => (
        <Bar key={id} id={id} index={i} />
      ))}
    </output>
  );
}

declare global {
  interface Window {
    __spinnerStart?: number;
  }
}
