import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { RigidBody } from "@react-three/rapier";

export function CeilingLight({ position, group, isGroupReady, light }) {
  const { nodes, materials } = useGLTF("/../assets/ceiling_light.glb");

  return (
    <group dispose={null} position={position} visible={light}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.defaultMaterial.geometry}
          material={materials.lamp_01}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ToonMaterial color={"#faffa3"} />
          {isGroupReady && (
            <VisibleEdges
              color="black"
              threshold={25}
              baseLineWidth={6}
              otherParent={true}
              parentPosition={group.current.position}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}

export function CeilingTile({
  position,
  args,
  color,
  light = false,
  rotation = [0, 0, 0],
}) {
  const group = useRef();
  const [isGroupReady, setIsGroupReady] = useState(false);

  useEffect(() => {
    if (group.current) {
      setIsGroupReady(true);
    }
  }, [group.current]);

  return (
    <group position={position} ref={group} rotation={rotation}>
      <RigidBody type="fixed" collider="cuboid">
        <mesh castShadow receiveShadow>
          <boxGeometry args={args} />
          <ToonMaterial color={color} />
          {isGroupReady && (
            <VisibleEdges
              color="black"
              threshold={15}
              baseLineWidth={15}
              otherParent={true}
              parentPosition={group.current.position}
            />
          )}
        </mesh>
      </RigidBody>
      <CeilingLight group={group} isGroupReady={isGroupReady} light={light} />
    </group>
  );
}

useGLTF.preload("/../assets/ceiling_light.glb");
