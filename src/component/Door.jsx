import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export function Door({ isOpen, position, rotation }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("../assets/door_sci-fi.glb");
  const up = useRef();
  const down = useRef();
  const left = useRef();
  const right = useRef();
  const [isGroupReady, setIsGroupReady] = useState(false);
  const [openDoor, setOpenDoor] = useState(false);
  const doorOpenRef = useRef(false);

  useEffect(() => {
    if (group.current) {
      setIsGroupReady(true);
    }
  }, [group.current]);

  useFrame(() => {
    if (!(up.current && down.current && left.current && right.current)) return;

    const currentUpPosition = up.current.translation();
    const currentDownPosition = down.current.translation();
    const currentLeftPosition = left.current.translation();
    const currentRightPosition = right.current.translation();

    const upLocalTargetY = isOpen.current ? 0.8 : 0;
    const downLocalTargetY = isOpen.current ? -2.4 : 0;
    const leftLocalTargetX = isOpen.current ? -0.5 : 0;
    const rightLocalTargetX = isOpen.current ? 0.5 : 0;

    const worldUpPosition = new THREE.Vector3(
      0,
      upLocalTargetY,
      0
    ).applyMatrix4(group.current.matrixWorld);
    const worldDownPosition = new THREE.Vector3(
      0,
      downLocalTargetY,
      0
    ).applyMatrix4(group.current.matrixWorld);
    const worldLeftPosition = new THREE.Vector3(
      leftLocalTargetX,
      0,
      0
    ).applyMatrix4(group.current.matrixWorld);
    const worldRightPosition = new THREE.Vector3(
      rightLocalTargetX,
      0,
      0
    ).applyMatrix4(group.current.matrixWorld);

    const smoothedUpY = THREE.MathUtils.lerp(
      currentUpPosition.y,
      worldUpPosition.y,
      isOpen.current ? 0.013 : 0.15
    );
    const smoothedDownY = THREE.MathUtils.lerp(
      currentDownPosition.y,
      worldDownPosition.y,
      isOpen.current ? 0.013 : 0.15
    );
    const smoothedLeftX = THREE.MathUtils.lerp(
      currentLeftPosition.x,
      worldLeftPosition.x,
      isOpen.current ? 0.15 : 0.013
    );
    const smoothedRightX = THREE.MathUtils.lerp(
      currentRightPosition.x,
      worldRightPosition.x,
      isOpen.current ? 0.15 : 0.013
    );

    up.current.setNextKinematicTranslation({
      x: worldUpPosition.x,
      y: smoothedUpY,
      z: worldUpPosition.z,
    });

    down.current.setNextKinematicTranslation({
      x: worldDownPosition.x,
      y: smoothedDownY,
      z: worldDownPosition.z,
    });

    left.current.setNextKinematicTranslation({
      x: smoothedLeftX,
      y: worldLeftPosition.y,
      z: worldLeftPosition.z,
    });

    right.current.setNextKinematicTranslation({
      x: smoothedRightX,
      y: worldRightPosition.y,
      z: worldRightPosition.z,
    });

    if (isOpen.current !== doorOpenRef.current) {
      doorOpenRef.current = isOpen.current;
      setOpenDoor(isOpen.current);
    }
  });

  return (
    <group
      ref={group}
      dispose={null}
      position={position}
      scale={1.3}
      rotation={rotation}
    >
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <RigidBody colliders={false} type="fixed">
                <CuboidCollider
                  position={[1.35, 1.9, 0]}
                  args={[0.35, 1.9, 0.4]}
                />
                <CuboidCollider
                  position={[-1.35, 1.9, 0]}
                  args={[0.35, 1.9, 0.4]}
                />
                <CuboidCollider position={[0, 3.5, 0]} args={[1, 0.33, 0.4]} />
                <group name="Arch_0" position={[0.0400659, 1.9979043, 0]}>
                  <mesh
                    name="Object_4"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_4.geometry}
                    material={materials.Pannel}
                  >
                    <ToonMaterial color={"#a3a7b5"} />
                    {isGroupReady && (
                      <VisibleEdges
                        color="black"
                        threshold={25}
                        baseLineWidth={10}
                        otherParent={true}
                        parentPosition={group.current.position}
                      />
                    )}
                  </mesh>
                </group>

                <group name="Ventelai001_4" position={[0, 0.4492139, 0]}>
                  <mesh
                    name="Object_12"
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_12.geometry}
                    material={materials["Arch.001"]}
                  >
                    <ToonMaterial color={"#dadaf7"} />
                    {isGroupReady && (
                      <VisibleEdges
                        color="black"
                        threshold={10}
                        baseLineWidth={3}
                        otherParent={true}
                        parentPosition={group.current.position}
                      />
                    )}
                  </mesh>
                </group>
              </RigidBody>
              <RigidBody colliders={false} type="kinematicPosition" ref={down}>
                <group name="Down_9">
                  <group name="Bone_8">
                    <group name="Door_Down_7">
                      <mesh
                        name="Object_18"
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_18.geometry}
                        material={materials.Door}
                      >
                        <ToonMaterial color={"#a3a7b5"} />
                        {isGroupReady && (
                          <VisibleEdges
                            color="black"
                            threshold={30}
                            baseLineWidth={8}
                            otherParent={true}
                            parentPosition={group.current.position}
                          />
                        )}
                      </mesh>
                    </group>
                  </group>
                </group>
              </RigidBody>
              <RigidBody colliders={false} type="kinematicPosition" ref={up}>
                <group
                  name="UP_12"
                  rotation={[0, 0, Math.PI]}
                  scale={0.7719729}
                  position={[0.0241259, 3.2328768, 0]}
                >
                  <group name="Bone_11">
                    <group
                      name="Door_up_10"
                      position={[0.031251, 4.1878114, -6e-7]}
                      rotation={[0, 0, -Math.PI]}
                      scale={1.2953823}
                    >
                      <mesh
                        name="Object_22"
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_22.geometry}
                        material={materials.Door}
                      >
                        <ToonMaterial color={"#ffb038"} />
                        {isGroupReady && (
                          <VisibleEdges
                            color="black"
                            threshold={30}
                            baseLineWidth={8}
                            otherParent={true}
                            parentPosition={group.current.position}
                          />
                        )}
                      </mesh>
                    </group>
                  </group>
                </group>
              </RigidBody>
              <RigidBody colliders={false} type="kinematicPosition" ref={left}>
                <group
                  name="Left_15"
                  position={[-0.9602127, 1.7225925, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                  scale={0.5791417}
                >
                  <group name="Bone_14">
                    <group
                      name="Door_Left_13"
                      position={[2.9743893, 1.6579919, -6e-7]}
                      rotation={[-1e-7, 0, Math.PI / 2]}
                      scale={1.726693}
                    >
                      <mesh
                        name="Object_26"
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_26.geometry}
                        material={materials.Door}
                      >
                        <ToonMaterial color={"#6d7185"} />
                        {isGroupReady && (
                          <VisibleEdges
                            color="black"
                            threshold={40}
                            baseLineWidth={6}
                            otherParent={true}
                            parentPosition={group.current.position}
                          />
                        )}
                      </mesh>
                    </group>
                  </group>
                </group>
              </RigidBody>
              <RigidBody colliders={false} type="kinematicPosition" ref={right}>
                <group
                  name="Right_18"
                  position={[0.9859475, 1.7346555, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={0.5791417}
                  ref={right}
                >
                  <group name="Bone_17">
                    <group
                      name="Door_Right_16"
                      position={[-2.9952178, 1.7024274, -6e-7]}
                      rotation={[-1e-7, 0, -Math.PI / 2]}
                      scale={1.726693}
                    >
                      <mesh
                        name="Object_30"
                        castShadow
                        receiveShadow
                        geometry={nodes.Object_30.geometry}
                        material={materials.Door}
                      >
                        <ToonMaterial color={"#6d7185"} />
                        {isGroupReady && (
                          <VisibleEdges
                            color="black"
                            threshold={40}
                            baseLineWidth={6}
                            otherParent={true}
                            parentPosition={group.current.position}
                          />
                        )}
                      </mesh>
                    </group>
                  </group>
                </group>
                {!openDoor && (
                  <CuboidCollider position={[0, 1.6, 0]} args={[1, 1.6, 0]} />
                )}
              </RigidBody>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("../assets/door_sci-fi.glb");
