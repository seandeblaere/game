import { Canvas } from "@react-three/fiber";
import { PointerLockControls, KeyboardControls, Bvh } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground, GroundShoot } from "./component/Ground";
import { Cube, CubeShoot } from "./component/Cube";
import { Wall, WallShoot } from "./component/Wall";
import { Player } from "./component/Player";
import { JumpPad } from "./component/JumpPad";
import { Button } from "./component/Button";
import { Box } from "./component/Box";
import { Door } from "./component/Door";
import { Performance } from "./performance/Performance";
import { Leva } from "leva";
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

            <Physics gravity={[0, -15, 0]}>
              <Ground args={[8, 12]} position={[20, 0, 4]} color="#71a4bf" />
              <CubeShoot args={[8, 0.8, 6]} position={[20, 0.4, 13]} />
              <CubeShoot position={[20, 18, 15]} args={[8, 0.1, 24]} />
              <Cube
                position={[20, 18, -5]}
                args={[8, 0.1, 16]}
                color="#71a4bf"
              />
              <GroundShoot args={[25, 25]} />
              <Cube
                position={[20, 3, 4]}
                args={[2.5, 0.5, 2.5]}
                color="#dff2a0"
              />
              <Cube
                position={[20, 3.5, -7.5]}
                args={[8, 7, 11]}
                color="#ff9980"
              />
              <Wall
                args={[40, 18]}
                position={[24, 9, 7]}
                rotation={[Math.PI, -Math.PI / 2, 0]}
                color="#b7e1f7"
              />
              <Player />
              <CubeShoot args={[5, 5, 5]} position={[-2, 2.01, -8]} />
              <JumpPad />
              <JumpPad position={[20, 3.25, 4]} />
              <Box />
              <Door isOpen={isButtonPressed} />
              <Button
                isPressed={isButtonPressed}
                setPressed={setIsButtonPressed}
              />
            </Physics>
          </Bvh>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </>
  );
}
