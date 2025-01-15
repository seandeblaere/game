import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import {
  PerspectiveCamera,
  useFBO,
  MeshTransmissionMaterial,
  ContactShadows,
  PositionalAudio,
} from "@react-three/drei";
import useTeleport from "../hooks/useTeleport";
import animateMaterialColor from "../utils/animateMaterialColor";

export function Portal({ thisPortal, otherPortal, dpr, sharedCooldown }) {
  const rigidBodyRef = useRef();
  const portalCameraRef = useRef();
  const mesh = useRef();
  const material = useRef();
  const renderTarget = useFBO({
    stencilBuffer: false,
    resolution: 32 * dpr,
  });
  const { camera } = useThree();
  const bRef = useRef(0.5);
  const gRef = useRef(0.5);
  const [btarget, setBTarget] = useState(1);
  const [gtarget, setGTarget] = useState(1);
  const { teleportPlayer } = useTeleport({ playerName: "Player", camera });

  useFrame((_, delta) => {
    if (sharedCooldown.current > 0) {
      sharedCooldown.current -= delta;
    }
  });

  useFrame((_, delta) => {
    animateMaterialColor({
      ref: bRef,
      targetState: btarget,
      setTargetState: setBTarget,
      materialRef: material,
      colorProperty: "b",
      delta,
      speed: 0.5,
    });

    animateMaterialColor({
      ref: gRef,
      targetState: gtarget,
      setTargetState: setGTarget,
      materialRef: material,
      colorProperty: "g",
      delta,
      speed: 1,
    });
  });

  useEffect(() => {
    if (!portalCameraRef.current) return;
    portalCameraRef.current.layers.disable(3);

    if (thisPortal.name == "portal1") {
      portalCameraRef.current.layers.disable(1);
      portalCameraRef.current.layers.enable(2);
    }

    if (thisPortal.name == "portal2") {
      portalCameraRef.current.layers.disable(2);
      portalCameraRef.current.layers.enable(1);
    }
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      const worldPosition = new THREE.Vector3();

      const quaternion = new THREE.Quaternion();

      thisPortal.parent.localToWorld(worldPosition.copy(thisPortal.position));
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

  const handleTeleport = (payload) => {
    teleportPlayer({ payload, otherPortal, thisPortal, sharedCooldown });
  };

  return (
    <>
      <RigidBody
        sensor
        ref={rigidBodyRef}
        type="fixed"
        colliders={false}
        onIntersectionEnter={handleTeleport}
      >
        <group>
          <MeshCollider type="trimesh">
            <mesh ref={mesh} layers={thisPortal.name === "portal1" ? 1 : 2}>
              <circleGeometry args={[1.5, 32]} />
              <meshStandardMaterial />
            </mesh>
          </MeshCollider>

          <mesh ref={material} layers={thisPortal.name === "portal1" ? 1 : 2}>
            <circleGeometry args={[1.5, 32]} />
            <meshBasicMaterial transparent={true} opacity={0} />
            {!otherPortal && (
              <MeshTransmissionMaterial
                ior={3}
                thickness={9}
                resolution={32}
                samples={1}
                roughness={0.2}
                distortion={4}
                distortionScale={2}
                temporalDistortion={0.4}
                backside={false}
                chromaticAberration={10}
              />
            )}
          </mesh>
        </group>
      </RigidBody>
      <PerspectiveCamera
        ref={portalCameraRef}
        near={0.1}
        far={50}
        fov={camera.fov}
        aspect={1}
        zoom={0.45}
        resolution={32 * dpr}
        samples={Math.ceil(dpr)}
      />
    </>
  );
}
