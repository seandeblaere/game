import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export function CeilingLight({ position, group, isGroupReady }) {
  const { nodes, materials } = useGLTF("/../assets/ceiling_light.glb");
  return (
    <group dispose={null} position={position}>
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

export function CeilingTile({ position, args, color }) {
  const group = useRef();
  const spotlight = useRef();
  const spotlightHelper = useRef();
  const [isGroupReady, setIsGroupReady] = useState(false);

  useEffect(() => {
    if (group.current) {
      setIsGroupReady(true);
    }
  }, [group.current]);

  useEffect(() => {
    if (spotlight.current && spotlightHelper.current) {
      spotlightHelper.current.update();
    }
  }, [spotlight.current]);

  useEffect(() => {
    if (spotlight.current) {
      // Create the SpotLightHelper and add it to the scene
      const helper = new THREE.SpotLightHelper(spotlight.current);
      spotlightHelper.current = helper;
      group.current.add(helper);

      // Cleanup
      return () => {
        group.current.remove(helper);
        helper.dispose();
      };
    }
  }, [spotlight.current]);

  return (
    <group position={position} ref={group}>
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
      <CeilingLight group={group} isGroupReady={isGroupReady} />
      <spotLight
        ref={spotlight}
        position={[0, -10, 0]}
        distance={50}
        decay={1.2}
        intensity={5}
        angle={0.1}
        castShadow
      />
    </group>
  );
}

useGLTF.preload("/../assets/ceiling_light.glb");
