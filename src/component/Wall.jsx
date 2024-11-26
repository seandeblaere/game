import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function Wall({ position = [0, 0, 0], ...props }) {
  const rigidBodyRef = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2); // Optional: Stagger motion with a random offset

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Calculate smooth oscillation in Y-axis
    const y = position[1] + Math.sin(time + timeOffset) * 2; // Amplitude of 2 units

    // Update kinematic position
    rigidBodyRef.current.setNextKinematicTranslation({
      x: position[0],
      y,
      z: position[2],
    });
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition" // Kinematic for controlled motion
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
