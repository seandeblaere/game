import { Canvas } from "@react-three/fiber";
import { PointerLockControls, KeyboardControls, Bvh } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground, GroundShoot } from "./component/Ground";
import { Player } from "./component/Player";
import { Wall } from "./component/WallTile";
import { Pipes } from "./component/Pipes";
import { Floor } from "./component/Floor";
import { CeilingTile } from "./component/Ceiling";
import { Performance } from "./performance/Performance";
import { JumpPad } from "./component/JumpPad";
import { KEYS, CANVAS_PROPS } from "./Const/constants";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { NightSky } from "./component/NightSky";
import { useState, Suspense } from "react";
import { Cube } from "./component/Cube";

export function App() {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  return (
    <>
      <KeyboardControls map={KEYS}>
        <Canvas {...CANVAS_PROPS}>
          <Suspense>
            <Performance />
            <Bvh>
              <NightSky />
              <ambientLight intensity={0.8} />

              <Physics gravity={[0, -15, 0]}>
                <GroundShoot position={[0, -3, 0]} />

                <CeilingTile
                  position={[-0.045, 9.4, -2]}
                  args={[4.1, 0.1, 6]}
                  color={"#7baae8"}
                />

                <Wall
                  columns={4}
                  position={[-4.95, 0, 10]}
                  rotation={[0, Math.PI, 0]}
                />

                <Wall columns={5} position={[4.89, 0, -2.4]} />

                <Wall
                  columns={1}
                  position={[0, 0, -7.4]}
                  rotation={[0, Math.PI / 2, 0]}
                  shoot
                />

                <Wall
                  columns={3}
                  position={[-12.53, 0, 9.3]}
                  rotation={[0, Math.PI / 2, 0]}
                />

                <Wall
                  columns={4}
                  position={[0, 0, 19.3]}
                  rotation={[0, -Math.PI / 2, 0]}
                  shoot
                />

                <Pipes position={[-2.5, 0.8, 8]} />
                <Pipes
                  position={[-7, 0.8, 11.8]}
                  rotation={[0, -Math.PI / 2, 0]}
                />
                <Floor position={[-1.5, 0.1, -3]} rows={7} />
                <Floor position={[-22.5, 0.1, 13]} columns={7} />
                <Cube
                  position={[-15, 3, 14.5]}
                  args={[3, 0.5, 3]}
                  color={"#d2b0f7"}
                />
                <JumpPad position={[-15, 3.25, 14.5]} />

                <Player />
              </Physics>
            </Bvh>
            <PointerLockControls />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}
