import { Canvas } from "@react-three/fiber";
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
import { NightSky } from "./component/NightSky";
import { useState, Suspense } from "react";
import { Cube, CubeShoot, CubePressed } from "./component/Cube";
import { Button } from "./component/Button";
import { Box } from "./component/Box";
import { Door } from "./component/Door";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function App({ setFinished }) {
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isButton2Pressed, setIsButton2Pressed] = useState(false);

  const handleEnter = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    if (isPlayer) {
      setFinished(true);
      console.log("congrats, you have finished the game!");
    }
  };

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
                  columns={10}
                  rows={6}
                  position={[-42.21, 0, 9.3]}
                  rotation={[0, Math.PI / 2, 0]}
                />

                <Wall
                  columns={3}
                  rows={4}
                  position={[-42.9, 9.38, 22.65]}
                  rotation={[0, -Math.PI, 0]}
                />

                <Wall
                  columns={1}
                  rows={3}
                  position={[-42.9, 14.07, 26.89]}
                  rotation={[0, -Math.PI, 0]}
                />

                <Wall
                  columns={2}
                  rows={4}
                  position={[-42.9, 9.38, 35.37]}
                  rotation={[0, -Math.PI, 0]}
                />

                <Wall
                  columns={5}
                  rows={4}
                  position={[-21.25, 9.38, 36.27]}
                  rotation={[0, -Math.PI / 2, 0]}
                />

                <Wall
                  columns={1}
                  rows={2}
                  position={[-16.2, 18.76, 14.45]}
                  rotation={[0, 0, 0]}
                />

                <Wall
                  columns={2}
                  rows={2}
                  position={[-22.52, 9.38, 27.17]}
                  rotation={[0, 0, 0]}
                />

                <Wall
                  columns={5}
                  rows={4}
                  position={[-16.2, 9.38, 18.69]}
                  rotation={[0, 0, 0]}
                />

                <Wall
                  columns={1}
                  rows={2}
                  position={[0, 0, 19.3]}
                  rotation={[0, -Math.PI / 2, 0]}
                  shoot
                />

                <Wall
                  columns={4}
                  rows={4}
                  position={[-4.24, 0, 19.3]}
                  rotation={[0, -Math.PI / 2, 0]}
                  shoot
                />

                <Pipes position={[-2.5, 1.2, 8]} />
                <Pipes
                  position={[-7, 1.2, 11.8]}
                  rotation={[0, -Math.PI / 2, 0]}
                />
                <Pipes position={[-25.35, 11, 28]} scale={0.125} />

                <Floor position={[-1.5, 0.1, -3]} rows={7} />
                <Floor position={[-22.5, 0.1, 13]} columns={7} />
                <Floor position={[-41.4, 10.039, 13.5]} columns={8} rows={3} />

                <Floor position={[-26.4, 10.039, 22.5]} columns={3} rows={2} />

                <Floor position={[-41.4, 10.039, 22.5]} columns={3} rows={2} />

                <Floor position={[-41.4, 10.039, 28.5]} columns={8} rows={3} />
                <Cube
                  position={[-15, 3.5, 14.5]}
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
                  position={[-30.85, 4, 23.95]}
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
                  position={[-37, 10.7, 17]}
                  args={[5, 0.5, 5]}
                  color={"#f5f3ed"}
                />

                <CubeShoot
                  position={[-22, 10, 29.1]}
                  args={[5, 0.5, 8.2]}
                  color={"#f5f3ed"}
                />

                <Cube
                  position={[-22, 18.6, 29.1]}
                  args={[6.4, 0.1, 8.6]}
                  color={"#7baae8"}
                />

                <Cube
                  position={[-32, 21, 17]}
                  args={[5, 0.5, 5]}
                  color={"#ffbae5"}
                />

                <Cube
                  position={[-37, 13, 23.95]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-37, 14.2, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-32.5, 15.8, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Cube
                  position={[-28, 17, 28.5]}
                  args={[2.5, 2.5, 2.5]}
                  color={"#fff475"}
                />

                <Button
                  isPressed={isButtonPressed}
                  setPressed={setIsButtonPressed}
                  position={[-31, 10.15, 17]}
                />

                <Button
                  isPressed={isButton2Pressed}
                  setPressed={setIsButton2Pressed}
                  position={[-32, 21.35, 17]}
                />

                <Box position={[-28, 15, 16]} />
                <Box position={[-22, 15, 29.5]} />

                <Door
                  position={[-40, 10.039, 27]}
                  rotation={[0, Math.PI / 2, 0]}
                  isOpen={isButton2Pressed}
                />

                <RigidBody
                  colliders={false}
                  type="fixed"
                  sensor
                  onIntersectionEnter={(payload) => handleEnter(payload)}
                >
                  <CuboidCollider
                    position={[-40.29, 12, 27]}
                    args={[2, 2, 0.1]}
                    rotation={[0, Math.PI / 2, 0]}
                  />
                </RigidBody>

                <JumpPad position={[-15, 3.75, 14.5]} color={"#00FF00"} />

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
