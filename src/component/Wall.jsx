import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function Wall({ position = [0, 0, 0], ...props }) {
  const rigidBodyRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = position[1] + Math.sin(time + timeOffset) * 2;

    // Ensure rigidBodyRef.current is not null
    if (rigidBodyRef.current) {
      // Update kinematic position
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
      <mesh castShadow receiveShadow name="wall">
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
