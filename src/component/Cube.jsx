import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Edges, Outlines } from "@react-three/drei";

export function Cube(props) {
  const cubeRef = useRef();
  return (
    <>
      <RigidBody {...props} type="fixed" collider="cuboid">
        <mesh
          name="cube"
          ref={cubeRef}
          position={[0, 1.2, -10]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[10, 10, 10]} />
          <meshStandardMaterial color="white" />
          <Edges linewidth={2} threshold={15} color="black" />
          <Outlines thickness={4} color="#e67b17" />
        </mesh>
      </RigidBody>
    </>
  );
}
