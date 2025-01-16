import { Canvas, useFrame } from "@react-three/fiber";
import {
  PointerLockControls,
  KeyboardControls,
  Bvh,
  Loader,
  BakeShadows,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
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
import { Cube, CubeShoot, CubePressed } from "./component/Cube";
import { SpotLightHelper, PointLightHelper } from "three";
import { useRef, useEffect } from "react";
import { Button } from "./component/Button";
import { Box } from "./component/Box";

export function App() {
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  function SpotlightWithHelper({ position, intensity = 12 }) {
    const lightRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
      if (lightRef.current) {
        const helper = new PointLightHelper(lightRef.current);
        helperRef.current = helper;

        lightRef.current.parent.add(helper);
      }
    }, []);

    useFrame(() => {
      if (helperRef.current) helperRef.current.update();
    });

    return (
      <pointLight
        intensity={intensity}
        color={"#7493ed"}
        position={position}
        ref={lightRef}
      />
    );
  }

  return (
    <>
      <KeyboardControls map={KEYS}>
        <Canvas {...CANVAS_PROPS}>
          <Suspense>
            <Performance />
            <Bvh>
              <NightSky />

              <ambientLight intensity={1.2} />

              <Physics gravity={[0, -15, 0]}>
                <CeilingTile
                  position={[-0.045, 9.4, -2]}
                  args={[4.1, 0.1, 6]}
                  color={"#7baae8"}
                  light
                />

                <CeilingTile
                  position={[-0.045, 9.4, 10]}
                  args={[4.1, 0.1, 6]}
                  color={"#7baae8"}
                  light
                />

                <CeilingTile
                  position={[-0.045, 9.4, 14.7]}
                  args={[4.1, 0.1, 3.4]}
                  color={"#7baae8"}
                />

                <CeilingTile
                  position={[-0.045, 9.4, 14.7]}
                  args={[4.1, 0.1, 3.4]}
                  color={"#7baae8"}
                />

                <CeilingTile
                  position={[-0.045, 9.4, 4]}
                  args={[4.1, 0.1, 6]}
                  color={"#7baae8"}
                  light
                />

                <CeilingTile
                  position={[-2, 11.8, 14.25]}
                  args={[4.65, 0.1, 4.2]}
                  color={"#7baae8"}
                  rotation={[0, 0, -Math.PI / 2]}
                  light
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
                  columns={8}
                  rows={4}
                  position={[-33.73, 0, 9.3]}
                  rotation={[0, Math.PI / 2, 0]}
                />

                <Wall
                  columns={5}
                  rows={4}
                  position={[0, 0, 19.3]}
                  rotation={[0, -Math.PI / 2, 0]}
                  shoot
                />

                <Pipes position={[-2.5, 1.2, 8]} />
                <Pipes
                  position={[-7, 1.2, 11.8]}
                  rotation={[0, -Math.PI / 2, 0]}
                />
                <Floor position={[-1.5, 0.1, -3]} rows={7} />
                <Floor position={[-22.5, 0.1, 13]} columns={7} />
                <Floor position={[-41.4, 10.039, 13.5]} columns={8} rows={3} />

                <Floor position={[-26.4, 10.039, 22.5]} columns={3} rows={2} />

                <Floor position={[-41.4, 10.039, 22.5]} columns={3} rows={2} />

                <Floor position={[-41.4, 10.039, 28.5]} columns={8} rows={3} />
                <Cube
                  position={[-15, 5, 14.5]}
                  args={[3, 0.5, 3]}
                  color={"#c4cef2"}
                />

                <Cube
                  position={[-25.9, 5, 14.3]}
                  args={[14, 10, 4.3]}
                  color={"#c9ffc9"}
                />

                <CubeShoot
                  position={[-10.47, 19.03, 14.3]}
                  args={[16.96, 0.5, 4.15]}
                  color={"#f5f3ed"}
                  shoot
                />

                <Cube
                  position={[-30.9, 0, 21]}
                  args={[6, 20, 0.1]}
                  color={"#c9ffc9"}
                />
                <Cube
                  position={[-27.85, 0, 23.95]}
                  args={[0.1, 20, 6]}
                  color={"#ecfc86"}
                />
                <Cube
                  position={[-33.85, 0, 23.95]}
                  args={[0.1, 20, 6]}
                  color={"#f5c7ff"}
                />
                <Cube
                  position={[-30.9, 0, 27]}
                  args={[6, 20, 0.1]}
                  color={"#ff734d"}
                />

                <CubeShoot
                  position={[-30.85, 0, 23.95]}
                  args={[5.8, 0.5, 5.8]}
                  color={"#f5f3ed"}
                />

                <CubePressed
                  position={[-30.85, 10, 23.95]}
                  args={[5.8, 0.5, 5.8]}
                  color={"#ff734d"}
                  isPressed={isButtonPressed}
                />

                <CubeShoot
                  position={[-37, 11, 17]}
                  args={[5, 0.5, 5]}
                  color={"#f5f3ed"}
                />

                <Cube
                  position={[-37, 13, 23.95]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-37, 14, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-32.5, 15, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-28, 16, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-26, 17, 23.95]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Button
                  isPressed={isButtonPressed}
                  setPressed={setIsButtonPressed}
                  position={[-24, 10.15, 21]}
                />

                <Box position={[-30.85, 15, 23.95]} />

                <JumpPad position={[-15, 5.25, 14.5]} color={"#00FF00"} />

                <Player />
              </Physics>
            </Bvh>
            <PointerLockControls />
            <BakeShadows />
          </Suspense>
        </Canvas>
        <Loader />
      </KeyboardControls>
    </>
  );
}
