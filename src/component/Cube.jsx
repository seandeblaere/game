import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";

export function Cube(props) {
  const cubeRef = useRef();

  return (
    <>
      <RigidBody {...props} type="fixed" collider="cuboid">
        <mesh
          name="cube"
          ref={cubeRef}
          position={[4, 2.01, -10]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4, 4, 4]} />
          <ToonMaterial color={"#A2D5F2"} />
          <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
        </mesh>
      </RigidBody>
    </>
  );
}
