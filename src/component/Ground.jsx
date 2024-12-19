import { RigidBody } from "@react-three/rapier";
import { ToonMaterial } from "../material/ToonMaterial";
import { Edges } from "@react-three/drei";

export function Ground({
  position = [0, 0, 0],
  args = [50, 50],
  color = "#a0b3bd",
  isCeiling = false,
}) {
  const rotation = isCeiling
    ? [-Math.PI * 0.5, -Math.PI, 0]
    : [-Math.PI * 0.5, 0, 0];

  return (
    <RigidBody type="fixed" collider="cuboid">
      <mesh receiveShadow position={position} rotation={rotation} name="ground">
        <planeGeometry args={args} />
        <ToonMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

export function GroundShoot({
  position = [0, 0, 0],
  args = [50, 50],
  color = "#e8f4fa",
  isCeiling = false,
}) {
  const rotation = isCeiling
    ? [-Math.PI * 0.5, -Math.PI, 0]
    : [-Math.PI * 0.5, 0, 0];

  return (
    <RigidBody type="fixed" collider="cuboid">
      <mesh
        receiveShadow
        position={position}
        rotation={rotation}
        name="groundShoot"
      >
        <planeGeometry args={args} />
        <ToonMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
