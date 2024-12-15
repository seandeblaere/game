import { useState } from "react";
import { PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";

export function Performance() {
  const [dpr, setDpr] = useState(2);
  const [factor, setFactor] = useState(0.5);

  return (
    <>
      <PerformanceMonitor
        factor={factor}
        bounds={(refreshrate) => (refreshrate > 90 ? [45, 80] : [45, 55])}
        onIncline={() => {
          setDpr(Math.min(dpr + 0.3, 2));
        }}
        onDecline={() => {
          setDpr(Math.max(dpr - 0.3, 0.5));
        }}
        onChange={({ factor }) => {
          setFactor(factor);
          setDpr(Math.floor(0.5 + 1.5 * factor));
        }}
        flipflops={2}
        onFallback={() => setDpr(0.5)}
      />
      <AdaptiveDpr pixelated />
    </>
  );
}
