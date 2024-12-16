import { Canvas } from "@react-three/fiber";
import { PointerLockControls, KeyboardControls, Bvh } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./component/Ground";
import { Cube } from "./component/Cube";
import { Wall } from "./component/Wall";
import { Player } from "./component/Player";
import { JumpPad } from "./component/JumpPad";
import { Box } from "./component/Box";
import { Performance } from "./performance/Performance";
import { Leva } from "leva";
import { KEYS, CANVAS_PROPS } from "./Const/constants";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NightSky } from "./component/NightSky";

export function App() {
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

            <Physics gravity={[0, -15, 0]}>
              <Ground />
              <Cube />
              <Player />
              <JumpPad />
              <Box />
            </Physics>
          </Bvh>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
