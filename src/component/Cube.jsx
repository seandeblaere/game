import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { useFrame } from "@react-three/fiber";

export function Cube({
  position = [0, 0, 0],
  args = [4, 4, 4],
  color = "#a0b3bd",
}) {
  return (
    <RigidBody type="fixed" collider="cuboid">
      <mesh name="cube" position={position} castShadow receiveShadow>
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

export function CubePressed({
  position = [0, 0, 0],
  args = [4, 4, 4],
  color = "#a0b3bd",
  isPressed,
}) {
  const cubeRef = useRef();
  const pressedPosition = 10;

  useFrame((state, delta) => {
    if (cubeRef.current) {
      const currentPosition = cubeRef.current.translation().y;
      const targetPosition = isPressed.current ? pressedPosition : 0;
      const newPosition =
        currentPosition + (targetPosition - currentPosition) * delta;

      cubeRef.current.setTranslation({
        x: cubeRef.current.translation().x,
        y: newPosition,
        z: cubeRef.current.translation().z,
      });
    }
  });

  return (
    <RigidBody type="fixed" collider="cuboid" ref={cubeRef}>
      <mesh name="cube" position={position} castShadow receiveShadow>
        <boxGeometry args={args} />
        <ToonMaterial color={color} />
        <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
      </mesh>
    </RigidBody>
  );
}
