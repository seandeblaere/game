import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

export function Cube(props) {
  const cubeRef = useRef();
  return (
    <RigidBody {...props} type="fixed" collider="cuboid">
      <mesh
        name="cube"
        ref={cubeRef}
        position={[0, 1, -10]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
