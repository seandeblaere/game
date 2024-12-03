import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  Preload,
  PerformanceMonitor,
  usePerformanceMonitor,
  Outlines,
} from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { usePortalPlacement } from "./usePortalPlacement";
import { Portal } from "./component/Portal";
import { Gun } from "./component/Railgun";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const player = useRef();
  const gun = useRef();
  const { rapier, world } = useRapier();
  const [, getKeys] = useKeyboardControls();
  const [ready, setReady] = useState(false);

  const [portal1, setPortal1] = useState(null);
  const [portal2, setPortal2] = useState(null);

  const [dpr, setDpr] = useState(1.5);

  const portal1Ref = useRef(null);
  const portal2Ref = useRef(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.layers.enableAll();
    console.log("Camera layers enabled for all.");
  }, [camera]);

  const placePortal = usePortalPlacement(
    (portalType, object, localPosition, normal) => {
      const portalData = {
        parent: object,
        position: localPosition,
        normal,
        name: portalType,
      };

      if (portalType === "portal1") {
        setPortal1(portalData);
        portal1Ref.current = portalData; // Update ref
      } else if (portalType === "portal2") {
        setPortal2(portalData);
        portal2Ref.current = portalData; // Update ref
      }
    },
    portal1Ref.current,
    portal2Ref.current
  );

  useEffect(() => {
    if (player.current) {
      setReady(true);
    }
  }, [player.current]);

  useEffect(() => {
    const handleMouseClick = () => {
      console.log("clicking");
      placePortal();
      gun.current.children[0].rotation.x = THREE.MathUtils.lerp(
        gun.current.children[0].rotation.x,
        gun.current.children[0].rotation.x + 0.15,
        0.3
      );
      gun.current.children[0].position.z = THREE.MathUtils.lerp(
        gun.current.children[0].position.z,
        gun.current.children[0].position.z + 0.2,
        0.5
      );
    };

    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, [placePortal]);

  useFrame((state) => {
    if (!ready) return;
    const { forward, backward, left, right, jump } = getKeys();
    const isMoving = forward || backward || left || right;

    const cameraDirection = new THREE.Vector3();
    state.camera.getWorldDirection(cameraDirection);

    const playerQuaternion = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        new THREE.Vector3(0, 0, 0),
        cameraDirection,
        new THREE.Vector3(0, 1, 0)
      )
    );

    player.current.setRotation(playerQuaternion, true);

    const velocity = player.current.linvel();

    state.camera.position.copy(player.current.translation());

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    player.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

    const ray = world.castRay(
      new rapier.Ray(player.current.translation(), { x: 0, y: -1, z: 0 })
    );
    const grounded = ray && ray.collider && Math.abs(ray.timeOfImpact) <= 1.75;
    if (jump && grounded) player.current.setLinvel({ x: 0, y: 7.5, z: 0 });

    if (gun.current && gun.current.children && gun.current.children[0]) {
      // Adjust the rotation axis to avoid flipping the gun
      gun.current.children[0].rotation.z = THREE.MathUtils.lerp(
        gun.current.children[0].rotation.z, // Current Z rotation
        Math.sin(isMoving * grounded * state.clock.elapsedTime * 7) / 30, // Oscillation for sideways rotation
        0.1
      );

      gun.current.children[0].position.x = THREE.MathUtils.lerp(
        gun.current.children[0].position.x, // Current Z rotation
        Math.sin(isMoving * grounded * state.clock.elapsedTime * 7) / 45 + 0.25, // Oscillation for sideways rotation
        0.1 // Smoothing factor
      );

      gun.current.children[0].rotation.x = THREE.MathUtils.lerp(
        gun.current.children[0].rotation.x, // Current Z rotation
        !grounded * 0.12, // Oscillation for sideways rotation
        0.07 // Smoothing factor
      );

      gun.current.children[0].position.z = THREE.MathUtils.lerp(
        gun.current.children[0].position.z, // Current Z rotation
        0.33, // Oscillation for sideways rotation
        0.5 // Smoothing factor
      );

      gun.current.rotation.copy(state.camera.rotation);
      gun.current.position
        .copy(state.camera.position)
        .add(cameraDirection.multiplyScalar(1));
    }
  });

  return (
    <>
      <RigidBody
        ref={player}
        colliders={false}
        canSleep={false}
        mass={1}
        type="dynamic"
        position={[0, 10, 0]}
        enabledRotations={[false, false, false]}
        name="Player"
      >
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <group ref={gun}>
        <Gun
          position-x={0.25}
          position-y={-0.33}
          position-z={0.33}
          rotation={[0, Math.PI, 0]}
        />
      </group>
      <PerformanceMonitor
        onIncline={() => setDpr(1)}
        onDecline={() => setDpr(0.5)}
        flipflops={3}
        onFallback={() => setDpr(0.5)}
      >
        {portal1 && (
          <Portal thisPortal={portal1} otherPortal={portal2} dpr={dpr} />
        )}
        {portal2 && (
          <Portal thisPortal={portal2} otherPortal={portal1} dpr={dpr} />
        )}
      </PerformanceMonitor>
    </>
  );
}
