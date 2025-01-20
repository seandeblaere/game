import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

export function Button({ isPressed, setPressed, position }) {
  const { nodes } = useGLTF("/../assets/button.glb");
  const buttonRef = useRef();
  const pressedPosition = position[1] - 0.08;
  const unpressedPosition = position[1] + 0.055;
  const group = useRef();
  const [isGroupReady, setIsGroupReady] = useState(false);

  useEffect(() => {
    if (group.current) {
      setIsGroupReady(true);
    }
  }, [group.current]);

  useFrame((state, delta) => {
    if (buttonRef.current) {
      const currentPosition = buttonRef.current.translation().y;
      const targetPosition = isPressed.current
        ? pressedPosition
        : unpressedPosition;
      const newPosition =
        currentPosition + (targetPosition - currentPosition) * delta;

      buttonRef.current.setTranslation({
        x: buttonRef.current.translation().x,
        y: newPosition,
        z: buttonRef.current.translation().z,
      });
    }
  });

  const handleCollisionEnter = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    const isCube = payload.other.rigidBodyObject?.name === "Box";
    const isAttachedCube =
      payload.other.rigidBodyObject?.name === "AttachedBox";
    if (isPlayer || isCube || isAttachedCube) {
      isPressed.current = true;
    }
  };

  const handleCollisionExit = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    const isCube = payload.other.rigidBodyObject?.name === "Box";
    const isAttachedCube =
      payload.other.rigidBodyObject?.name === "AttachedBox";
    if (isPlayer || isCube || isAttachedCube) {
      isPressed.current = false;
    }
  };

  return (
    <>
      <group dispose={null} scale={0.4} ref={group} position={position}>
        <RigidBody colliders={false} type="fixed">
          <MeshCollider type="hull">
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder9_defaultPolygonShader_0.geometry}
              scale={0.01}
            >
              <ToonMaterial color={"#d8f5b8"} />
              {isGroupReady && (
                <VisibleEdges
                  color="black"
                  threshold={5}
                  baseLineWidth={5}
                  otherParent={true}
                  parentPosition={group.current.position}
                />
              )}
            </mesh>
          </MeshCollider>
        </RigidBody>

        <RigidBody
          ref={buttonRef}
          colliders={false}
          name="button"
          type="fixed"
          dominanceGroup={-127}
        >
          <MeshCollider type="hull">
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder10_defaultPolygonShader_0.geometry}
              scale={0.01}
            >
              <ToonMaterial color={"#ff6152"} />
              {isGroupReady && (
                <VisibleEdges
                  color="black"
                  threshold={5}
                  baseLineWidth={5}
                  otherParent={true}
                  parentPosition={group.current.position}
                />
              )}
            </mesh>
          </MeshCollider>
        </RigidBody>
      </group>
      <group dispose={null} scale={0.5} position={position}>
        <RigidBody
          colliders={false}
          name="button"
          type="fixed"
          onIntersectionEnter={(payload) => handleCollisionEnter(payload)}
          onIntersectionExit={(payload) => handleCollisionExit(payload)}
          sensor
        >
          <MeshCollider type="hull">
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.pCylinder10_defaultPolygonShader_0.geometry}
              scale={0.01}
            >
              <meshStandardMaterial transparent opacity={0} />
            </mesh>
          </MeshCollider>
        </RigidBody>
      </group>
    </>
  );
}

useGLTF.preload("/../assets/button.glb");
