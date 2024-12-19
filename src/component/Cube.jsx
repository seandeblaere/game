import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";

export function Cube({
  position = [0, 0, 0],
  args = [4, 4, 4],
  color = "#a0b3bd",
}) {
  const cubeRef = useRef();

  return (
    <RigidBody type="fixed" collider="cuboid">
      <mesh
        name="cube"
        ref={cubeRef}
        position={position}
        castShadow
        receiveShadow
      >
        <boxGeometry args={args} />
        <ToonMaterial color={color} />
        <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
      </mesh>
    </RigidBody>
  );
}

export function CubeShoot({
  position = [0, 0, 0],
  args = [4, 4, 4],
  color = "#e8f4fa",
}) {
  const cubeRef = useRef();

  return (
    <RigidBody type="fixed" collider="cuboid">
      <mesh
        name="cubeShoot"
        ref={cubeRef}
        position={position}
        castShadow
        receiveShadow
      >
        <boxGeometry args={args} />
        <ToonMaterial color={color} />
        <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
      </mesh>
    </RigidBody>
  );
}
