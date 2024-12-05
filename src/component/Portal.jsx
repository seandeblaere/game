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
  PositionalAudio,
} from "@react-three/drei";

export function Portal({ thisPortal, otherPortal, dpr, sharedCooldown }) {
  const rigidBodyRef = useRef();
  const portalCameraRef = useRef();
  const mesh = useRef();
  const renderTarget = useFBO({
    stencilBuffer: false,
    resolution: 32 * dpr,
  });
  const { camera } = useThree();
  const bRef = useRef(0.5);
  const gRef = useRef(0.5);
  const material = useRef();
  const [btarget, setBTarget] = useState(1);
  const [gtarget, setGTarget] = useState(1);

  useFrame((_, delta) => {
    if (sharedCooldown.current > 0) {
      sharedCooldown.current -= delta;
    }
  });

  useFrame((_, delta) => {
    if (Math.abs(bRef.current - btarget) < 0.01) {
      setBTarget(btarget === 1 ? 0 : 1);
    }

    bRef.current = THREE.MathUtils.lerp(bRef.current, btarget, delta * 0.5);

    material.current.material.color.b = bRef.current;
  });

  useFrame((_, delta) => {
    if (Math.abs(gRef.current - gtarget) < 0.01) {
      setGTarget(gtarget === 1 ? 0 : 1);
    }

    gRef.current = THREE.MathUtils.lerp(gRef.current, gtarget, delta * 1);

    material.current.material.color.g = gRef.current;
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
      return;
    }

    if (sharedCooldown.current > 0) {
      return;
    }

    sharedCooldown.current = 0.2;

    const playerRigidBody = payload.other.rigidBody;
    const { parent, position, normal, worldNormal } = otherPortal;

    const worldPosition = new THREE.Vector3();
    parent.localToWorld(worldPosition.copy(position));

    const teleportAndRotate = (
      entryNormal,
      exitNormal,
      rotate = false,
      flip = false
    ) => {
      let finalQuaternion = new THREE.Quaternion();
      if (rotate) {
        const exitQuaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          exitNormal
        );

        const entryQuaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          entryNormal
        );

        const relativeQuaternion = new THREE.Quaternion()
          .copy(entryQuaternion)
          .invert()
          .multiply(camera.quaternion.clone());

        const flipQuaternion = flip
          ? new THREE.Quaternion().setFromAxisAngle(
              new THREE.Vector3(0, 1, 0),
              Math.PI
            )
          : new THREE.Quaternion();

        finalQuaternion
          .copy(exitQuaternion)
          .multiply(flipQuaternion)
          .multiply(relativeQuaternion);
      } else {
        finalQuaternion = camera.quaternion.clone();
      }

      const offsetScalar = exitNormal.y === 0 ? 0.51 : 0.876;
      const offset = new THREE.Vector3()
        .copy(exitNormal)
        .multiplyScalar(offsetScalar);

      playerRigidBody.setTranslation(worldPosition.add(offset), true);

      const playerVelocity = playerRigidBody.linvel();

      const velocityVector = new THREE.Vector3(
        playerVelocity.x,
        playerVelocity.y,
        playerVelocity.z
      );

      const speed = velocityVector.length();
      console.log("Speed:", speed);

      const newVelocity = new THREE.Vector3()
        .copy(worldNormal)
        .multiplyScalar(speed);

      console.log("new velocity:", newVelocity);

      playerRigidBody.setLinvel(newVelocity, true);
      camera.quaternion.copy(finalQuaternion);
    };

    if (thisPortal.worldNormal.y === 0 && worldNormal.y === 0) {
      teleportAndRotate(thisPortal.normal, normal, true, true);
    } else if (thisPortal.worldNormal.y === 0 && worldNormal.y !== 0) {
      teleportAndRotate(thisPortal.normal, normal);
    } else if (thisPortal.worldNormal.y !== 0 && worldNormal.y === 0) {
      teleportAndRotate(thisPortal.normal, normal);
    } else if (thisPortal.worldNormal.y !== 0 && worldNormal.y !== 0) {
      teleportAndRotate(thisPortal.normal, normal);
    }
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
            <mesh ref={mesh} layers={thisPortal.name == "portal1" ? 1 : 2}>
              <circleGeometry args={[1.5, 32]} />
              <meshStandardMaterial />
            </mesh>
          </MeshCollider>

          <mesh ref={material} layers={thisPortal.name == "portal1" ? 1 : 2}>
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

            <Edges
              layers={thisPortal.name == "portal1" ? 1 : 2}
              linewidth={2}
              threshold={15}
              color="black"
            />
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
        zoom={0.45}
        resolution={32 * dpr}
        samples={Math.ceil(dpr)}
      />
    </>
  );
}
