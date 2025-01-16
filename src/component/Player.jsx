import * as THREE from "three";
import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, PerformanceMonitor } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { usePortalPlacement } from "../hooks/usePortalPlacement";
import { Portal } from "./Portal";
import { Gun } from "./Railgun";
import animateGun from "../utils/animateGun";

const SPEED = 6.5;
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
  const cooldownRef = useRef(0);

  const shootSound = useState(() => new Audio("/sounds/shoot.wav"))[0];

  useEffect(() => {
    camera.layers.enableAll();
  }, [camera]);

  const placePortal = usePortalPlacement(
    (portalType, object, localPosition, normal, worldNormal) => {
      const portalData = {
        parent: object,
        position: localPosition,
        normal,
        worldNormal,
        name: portalType,
      };

      if (portalType === "portal1") {
        setPortal1(portalData);
        portal1Ref.current = portalData;
      } else {
        setPortal2(portalData);
        portal2Ref.current = portalData;
      }
    },
    portal1Ref.current,
    portal2Ref.current
  );

  useEffect(() => {
    if (player.current) setReady(true);
  }, []);

  const handleMouseClick = () => {
    shootSound.currentTime = 0;
    shootSound.volume = 0.5;
    shootSound.play();
    placePortal();
    const gunPart = gun.current.children[0];
    gunPart.rotation.x = THREE.MathUtils.lerp(
      gunPart.rotation.x,
      gunPart.rotation.x + 0.15,
      0.3
    );
    gunPart.position.z = THREE.MathUtils.lerp(
      gunPart.position.z,
      gunPart.position.z + 0.2,
      0.5
    );
  };

  useEffect(() => {
    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, [handleMouseClick]);

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

    animateGun({
      gun,
      isMoving,
      grounded,
      state,
      cameraDirection,
    });
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
      <group ref={gun} layers={3}>
        <Gun
          position-x={0.25}
          position-y={-0.33}
          position-z={0.33}
          rotation={[0, Math.PI, 0]}
          layers={3}
        />
      </group>
      <PerformanceMonitor
        onIncline={() => setDpr(1)}
        onDecline={() => setDpr(0.5)}
        flipflops={3}
        onFallback={() => setDpr(0.5)}
      >
        {portal1 && (
          <Portal
            thisPortal={portal1}
            otherPortal={portal2}
            dpr={dpr}
            sharedCooldown={cooldownRef}
          />
        )}
        {portal2 && (
          <Portal
            thisPortal={portal2}
            otherPortal={portal1}
            dpr={dpr}
            sharedCooldown={cooldownRef}
          />
        )}
      </PerformanceMonitor>
    </>
  );
}
