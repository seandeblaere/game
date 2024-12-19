import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";

export function Wall({
  position = [0, 0, 0],
  rotation = [Math.PI, 0, 0],
  args = [5, 5],
  color = "#a0b3bd",
}) {
  const rigidBodyRef = useRef();

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" colliders="cuboid">
      <mesh
        castShadow
        receiveShadow
        name="wall"
        rotation={rotation}
        position={position}
      >
        <planeGeometry args={args} />
        <ToonMaterial color={color} />
        <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
      </mesh>
    </RigidBody>
  );
}

export function WallShoot({
  position = [0, 0, 0],
  rotation = [Math.PI, 0, 0],
  args = [5, 5],
  color = "#e8f4fa",
}) {
  const rigidBodyRef = useRef();

  return (
    <RigidBody ref={rigidBodyRef} type="fixed" colliders="cuboid">
      <mesh
        castShadow
        receiveShadow
        name="wallShoot"
        rotation={rotation}
        position={position}
      >
        <planeGeometry args={args} />
        <ToonMaterial color={color} />
        <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
      </mesh>
    </RigidBody>
  );
}
