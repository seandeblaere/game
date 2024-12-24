import { Canvas } from "@react-three/fiber";
import { PointerLockControls, KeyboardControls, Bvh } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground, GroundShoot } from "./component/Ground";
import { Player } from "./component/Player";
import { Wall } from "./component/WallTile";
import { Floor } from "./component/Floor";
import { Performance } from "./performance/Performance";
import { KEYS, CANVAS_PROPS } from "./Const/constants";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NightSky } from "./component/NightSky";
import { useState } from "react";

export function App() {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  return (
    <>
      <KeyboardControls map={KEYS}>
        <Canvas {...CANVAS_PROPS}>
          <Performance />
          <Bvh>
            <NightSky />
            <ambientLight intensity={1.2} />
            <directionalLight
              castShadow
              intensity={2}
              position={[0, 5, -14]}
              distance={50}
            />

            <Physics gravity={[0, -15, 0]} debug>
              <GroundShoot />
              <Wall />
              <Floor />
              <Player />
            </Physics>
          </Bvh>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
