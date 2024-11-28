import * as THREE from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import {
  PerspectiveCamera,
  useFBO,
  MeshTransmissionMaterial,
  MeshReflectorMaterial,
  ContactShadows,
  Edges,
  Outlines,
  PositionalAudio,
  Preload,
} from "@react-three/drei";
import { easing } from "maath";

export function Portal({ thisPortal, otherPortal }) {
  const rigidBodyRef = useRef();
  const portalCameraRef = useRef();
  const mesh = useRef();
  const renderTarget = useFBO({ depthBuffer: false, stencilBuffer: false });
  const { camera } = useThree();
  const [cooldown, setCooldown] = useState(false);
  const roughnessRef = useRef(0);

  /* const roughness = useFrame((_, delta) => {
    // Target roughness based on whether otherPortal exists
    const targetRoughness = 1;

    // Smoothly animate roughness toward the target value
    easing.damp(roughnessRef.current, "value", targetRoughness, 0.2, delta);

    // Update the material roughness
    console.log("Roughness:", roughnessRef.current);
  }); */

  useFrame(() => {
    if (rigidBodyRef.current) {
      const worldPosition = new THREE.Vector3();
      thisPortal.parent.localToWorld(worldPosition.copy(thisPortal.position));

      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        thisPortal.normal
      );

      rigidBodyRef.current.setTranslation(worldPosition, true);
      rigidBodyRef.current.setRotation(quaternion, true);
    }

    if (!otherPortal || !portalCameraRef.current) return;

    const otherWorldPosition = new THREE.Vector3();
    const otherWorldQuaternion = new THREE.Quaternion();
    otherPortal.parent.localToWorld(
      otherWorldPosition.copy(otherPortal.position)
    );
    otherWorldQuaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      otherPortal.normal
    );

    portalCameraRef.current.position.copy(otherWorldPosition);
    portalCameraRef.current.quaternion.copy(otherWorldQuaternion);

    portalCameraRef.current.aspect = 1;
    portalCameraRef.current.updateProjectionMatrix();
  });

  useFrame((state) => {
    const { gl, scene } = state;

    if (!otherPortal || !(portalCameraRef.current instanceof THREE.Camera)) {
      mesh.current.material.map = null;
      return;
    }

    gl.setRenderTarget(renderTarget);
    gl.render(scene, portalCameraRef.current);
    gl.setRenderTarget(null);

    mesh.current.material.map = renderTarget.texture;
  });

  const teleportPlayer = (payload) => {
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    if (!isPlayer || !otherPortal) {
      console.log("No other portal");
      return;
    }

    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 500);

    const playerRigidBody = payload.other.rigidBody;

    const { parent, position, normal } = otherPortal;
    const worldPosition = new THREE.Vector3();
    parent.localToWorld(worldPosition.copy(position));

    const exitQuaternion = new THREE.Quaternion();
    exitQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), normal);

    const entryPortalQuaternion = new THREE.Quaternion();
    const entryPortalNormal = thisPortal.normal;
    entryPortalQuaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      entryPortalNormal
    );

    const playerCameraQuaternion = camera.quaternion.clone();
    const relativeQuaternion = new THREE.Quaternion()
      .copy(entryPortalQuaternion)
      .invert()
      .multiply(playerCameraQuaternion);

    const flipQuaternion = new THREE.Quaternion();
    flipQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

    const finalExitQuaternion = new THREE.Quaternion()
      .copy(exitQuaternion)
      .multiply(flipQuaternion)
      .multiply(relativeQuaternion);

    const offset = new THREE.Vector3().copy(normal).multiplyScalar(0.6);
    const finalPosition = worldPosition.add(offset);

    playerRigidBody.setTranslation(finalPosition, true);
    camera.quaternion.copy(finalExitQuaternion);
  };

  return (
    <>
      <RigidBody
        sensor
        ref={rigidBodyRef}
        type="fixed"
        colliders={false}
        onIntersectionEnter={(payload) => teleportPlayer(payload)}
      >
        <group>
          <MeshCollider type="trimesh">
            <mesh ref={mesh}>
              <circleGeometry args={[0.8, 32]} />
              <meshStandardMaterial />
            </mesh>
          </MeshCollider>

          <mesh>
            <circleGeometry args={[0.8, 32]} />
            <meshBasicMaterial
              transparent={true} // Enable transparency
              opacity={0}
            />

            {/*<MeshTransmissionMaterial
              ior={1.1}
              thickness={9}
              resolution={32}
              samples={1}
              roughness={otherPortal ? 0 : 1}
              color="#ffd4f8"
              backside={false}
            />
            */}

            <Edges linewidth={2} threshold={15} color="black" />
          </mesh>

          <PositionalAudio
            autoplay
            loop
            url="./sounds/force_field.wav"
            distance={0.35}
          />
        </group>
      </RigidBody>
      <PerspectiveCamera
        ref={portalCameraRef}
        near={0.1}
        far={50}
        fov={camera.fov}
        aspect={1}
        zoom={0.5}
        resolution={64}
        samples={1}
      />
    </>
  );
}
