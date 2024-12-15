import { RigidBody } from "@react-three/rapier";
import { ToonMaterial } from "../material/ToonMaterial";

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
        <ToonMaterial />
      </mesh>
    </RigidBody>
  );
}
