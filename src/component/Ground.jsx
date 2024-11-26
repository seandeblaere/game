import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

export function Ground(props) {
  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh
        receiveShadow
        position={[0, 0, 0]}
        rotation-x={-Math.PI * 0.5}
        name="ground"
      >
        <planeGeometry args={[200, 200]} />

        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <CuboidCollider args={[20, 2, 20]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
