import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Edges, Outlines } from "@react-three/drei";

export function Ground(props) {
  return (
    <RigidBody {...props} type="fixed" collider="cuboid">
      <mesh
        receiveShadow
        position={[0, 0, 0]}
        rotation-x={-Math.PI * 0.5}
        name="ground"
      >
        <planeGeometry args={[200, 200]} />

        <meshStandardMaterial color="white" />
        <Edges linewidth={2} threshold={15} color="black" />
        <Outlines thickness={1} color="black" />
      </mesh>
    </RigidBody>
  );
}
