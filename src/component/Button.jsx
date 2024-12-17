import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

export function Button(props) {
  const { nodes } = useGLTF("/../assets/button.glb");
  const [pressed, setPressed] = useState(false);
  const buttonRef = useRef();
  const pressedPosition = -0.08;
  const unpressedPosition = 0.06;

  useFrame(() => {
    if (buttonRef.current) {
      const currentPosition = buttonRef.current.translation().y;
      const targetPosition = pressed ? pressedPosition : unpressedPosition;
      const newPosition =
        currentPosition + (targetPosition - currentPosition) * 0.05;

      buttonRef.current.setTranslation({ x: 2, y: newPosition, z: 5 });
    }
  });

  const handleCollisionEnter = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    const isCube = payload.other.rigidBodyObject?.name === "Box";
    const isAttachedCube =
      payload.other.rigidBodyObject?.name === "AttachedBox";
    if (isPlayer || isCube || isAttachedCube) {
      setPressed(true);
    }
  };

  const handleCollisionExit = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    const isCube = payload.other.rigidBodyObject?.name === "Box";
    const isAttachedCube =
      payload.other.rigidBodyObject?.name === "AttachedBox";
    if (isPlayer || isCube || isAttachedCube) {
      setPressed(false);
    }
  };

  return (
    <group {...props} dispose={null} scale={0.4} position={[2, 0.07, 5]}>
      <RigidBody colliders={false} type="fixed">
        <MeshCollider type="hull">
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pCylinder9_defaultPolygonShader_0.geometry}
            scale={0.01}
          >
            <ToonMaterial color={"#d8f5b8"} />
            <VisibleEdges color="black" threshold={5} baseLineWidth={5} />
          </mesh>
        </MeshCollider>
      </RigidBody>

      <RigidBody
        ref={buttonRef}
        colliders={false}
        name="button"
        type="fixed"
        onCollisionEnter={(payload) => handleCollisionEnter(payload)}
        onCollisionExit={(payload) => handleCollisionExit(payload)}
      >
        <MeshCollider type="hull">
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.pCylinder10_defaultPolygonShader_0.geometry}
            scale={0.01}
          >
            <ToonMaterial color={"#ff6152"} />
            <VisibleEdges color="black" threshold={5} baseLineWidth={5} />
          </mesh>
        </MeshCollider>
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/../assets/button.glb");
