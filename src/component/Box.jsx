import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";

export function Box({ position }) {
  const { nodes } = useGLTF("/../assets/generator3.glb");
  const cubeRef = useRef();
  const collisionRef = useRef();
  const currentPositionRef = useRef(new THREE.Vector3());
  const [isHeld, setIsHeld] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [name, setName] = useState("Box");
  const [inCollision, setInCollision] = useState(false);
  const { camera } = useThree();
  const [dominance, setDominance] = useState(false);

  const [, getKeys] = useKeyboardControls();

  const MIN_PICKUP_DISTANCE = 5;
  const floatAmplitude = 0.01;
  const floatSpeed = 0.8;

  const addDominance = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    if (!isPlayer) return;
    setDominance(true);
  };

  const removeDominance = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    if (!isPlayer) return;
    setDominance(false);
  };

  const handlePickupOrRelease = () => {
    const distanceToCube = camera.position.distanceTo(
      cubeRef.current.translation()
    );

    if (isHeld) {
      if (!inCollision) {
        setIsHeld(false);
        setName("Box");
      }
    } else if (isHovered && distanceToCube <= MIN_PICKUP_DISTANCE) {
      setIsHeld(true);
      setName("AttachedBox");
    }
  };

  useFrame(() => {
    if (getKeys().pickUp) {
      handlePickupOrRelease();
    }
    if (!cubeRef.current) return;

    cubeRef.current.name = name;

    if (isHeld) {
      const offset = new THREE.Vector3(0, -0.15, -2).applyQuaternion(
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
      cubeRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      const floatingOffset =
        Math.sin(Date.now() * 0.003 * floatSpeed) * floatAmplitude;
      const finalPosition = smoothedPosition.add(
        new THREE.Vector3(0, floatingOffset, 0)
      );

      cubeRef.current.setTranslation(finalPosition, true);
      currentPositionRef.current.copy(finalPosition);
    }

    if (dominance && isHeld) {
      cubeRef.current.setDominanceGroup(-127);
    } else {
      cubeRef.current.setDominanceGroup(0);
    }
  });

  return (
    <RigidBody
      ref={cubeRef}
      colliders={false}
      type="dynamic"
      name={name}
      position={position}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onCollisionEnter={(payload) => {
        setInCollision(true);
        addDominance(payload);
      }}
      onCollisionExit={(payload) => {
        setInCollision(false);
        removeDominance(payload);
      }}
    >
      <group dispose={null} scale={0.0025}>
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
              parentPosition={
                cubeRef.current?.translation() || currentPositionRef.current
              }
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
      <CuboidCollider ref={collisionRef} args={[0.252, 0.252, 0.252]} />
    </RigidBody>
  );
}

useGLTF.preload("../assets/generator3.glb");
