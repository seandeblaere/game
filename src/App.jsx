import { Canvas } from "@react-three/fiber";
import {
  Sky,
  PointerLockControls,
  KeyboardControls,
  Bvh,
  AdaptiveDpr,
  Stars,
  PerformanceMonitor,
} from "@react-three/drei";
import { useState } from "react";
import { Physics } from "@react-three/rapier";
import { Ground } from "./component/Ground";
import { Cube } from "./component/Cube";
import { Wall } from "./component/Wall";
import { Player } from "./Player";
import { JumpPad } from "./component/JumpPad";
import { Leva } from "leva";
import { Perf } from "r3f-perf";

export function App() {
  const [dpr, setDpr] = useState(2);
  const [factor, setFactor] = useState(0.5);

  return (
    <>
      <Leva collapsed />
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "left", keys: ["ArrowLeft", "KeyA"] },
          { name: "right", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
          { name: "switch", keys: ["KeyF"] },
        ]}
      >
        <Canvas
          gl={{
            stencil: false,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.3, max: 0.8 }}
          shadows
          camera={{ fov: 45 }}
          dpr={[0.5, 1]}
        >
          <PerformanceMonitor
            factor={factor}
            bounds={(refreshrate) => (refreshrate > 90 ? [45, 80] : [45, 55])}
            onIncline={() => {
              setDpr(Math.min(dpr + 0.3, 2));
              console.log("Performance improved");
            }}
            onDecline={() => {
              setDpr(Math.max(dpr - 0.3, 0.5));
              console.log("Performance declined");
            }}
            onChange={({ factor }) => {
              setFactor(factor);
              setDpr(Math.floor(0.5 + 1.5 * factor));
              console.log(`Performance changed, factor: ${factor}`);
            }}
            flipflops={2}
            onFallback={() => setDpr(0.5)}
          />
          <AdaptiveDpr pixelated />
          <Bvh>
            <Sky
              sunPosition={[0, -1, 0]}
              rayleigh={10}
              turbidity={40}
              mieCoefficient={0.1}
              mieDirectionalG={5}
            />
            <Stars
              radius={100}
              depth={45}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            <ambientLight intensity={3} />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />

            <Physics gravity={[0, -15, 0]}>
              <Ground />
              <Cube />
              <Wall />
              <Player />
              <JumpPad />
            </Physics>
          </Bvh>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
