import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

export function Box(props) {
  const { nodes } = useGLTF("/../assets/generator3.glb");
  const cubeRef = useRef();
  const currentPositionRef = useRef(new THREE.Vector3());
  const [isHeld, setIsHeld] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inCollision, setInCollision] = useState(false);
  const { camera } = useThree();

  const [, getKeys] = useKeyboardControls();

  const MIN_PICKUP_DISTANCE = 5;
  const floatAmplitude = 0.01;
  const floatSpeed = 0.8;

  const handlePickupOrRelease = () => {
    const distanceToCube = camera.position.distanceTo(
      cubeRef.current.translation()
    );

    if (isHeld) {
      if (getKeys().pickUp && !inCollision) {
        setIsHeld(false);
      }
    } else if (isHovered && distanceToCube <= MIN_PICKUP_DISTANCE) {
      setIsHeld(true);
    }
  };

  useFrame(() => {
    if (getKeys().pickUp || getKeys().release) {
      handlePickupOrRelease();
    }

    if (isHeld && cubeRef.current) {
      const offset = new THREE.Vector3(0, -0.25, -2).applyQuaternion(
        camera.quaternion
      );
      const targetPosition = camera.position.clone().add(offset);
      const currentPosition = cubeRef.current.translation();

      const smoothedPosition = new THREE.Vector3().lerpVectors(
        currentPosition,
        targetPosition,
        0.2
      );

      cubeRef.current.setTranslation(smoothedPosition, true);
      cubeRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

      const floatingOffset =
        Math.sin(Date.now() * 0.003 * floatSpeed) * floatAmplitude;
      const finalPosition = smoothedPosition.add(
        new THREE.Vector3(0, floatingOffset, 0)
      );

      cubeRef.current.setTranslation(finalPosition, true);
      currentPositionRef.current.copy(finalPosition);
    }
  });

  return (
    <RigidBody
      ref={cubeRef}
      colliders={false}
      type="dynamic"
      name="Box"
      position={[3, 2, 2]}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onCollisionEnter={() => {
        setInCollision(true);
      }}
      onCollisionExit={() => {
        setInCollision(false);
      }}
    >
      <group {...props} dispose={null} scale={0.0025}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Gen_HP001_All_0.geometry}
          >
            <ToonMaterial color="#aeb7c2" />
            <VisibleEdges
              color="black"
              threshold={30}
              otherParent={true}
              parentPosition={currentPositionRef.current}
            />
          </mesh>

          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Gen_HP001_Blue_0.geometry}
          >
            <ToonMaterial color="#faf6aa" />
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Gen_HP001_Red_0.geometry}
          >
            <ToonMaterial color="#ff6152" />
          </mesh>
        </group>
      </group>
      <CuboidCollider args={[0.252, 0.252, 0.252]} />
    </RigidBody>
  );
}

useGLTF.preload("../assets/generator3.glb");
