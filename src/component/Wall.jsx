import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function Wall({ position = [0, 0, 0], ...props }) {
  const rigidBodyRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = position[1] + Math.sin(time + timeOffset) * 2;

    if (rigidBodyRef.current) {
      rigidBodyRef.current.setNextKinematicTranslation({
        x: position[0],
        y,
        z: position[2],
      });
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      colliders="cuboid"
      {...props}
    >
      <mesh castShadow receiveShadow name="wall" rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
