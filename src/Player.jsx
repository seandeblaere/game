import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Preload } from "@react-three/drei";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { usePortalPlacement } from "./usePortalPlacement";
import { Portal } from "./component/Portal";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const player = useRef();
  const { rapier, world } = useRapier();
  const [, getKeys] = useKeyboardControls();
  const [ready, setReady] = useState(false);

  const [portal1, setPortal1] = useState(null);
  const [portal2, setPortal2] = useState(null);

  const portal1Ref = useRef(null);
  const portal2Ref = useRef(null);

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
      placePortal();
    };

    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("click", handleMouseClick);
    };
  }, [placePortal]);

  useFrame((state) => {
    if (!ready) return;
    const { forward, backward, left, right, jump } = getKeys();

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
      {portal1 && <Portal thisPortal={portal1} otherPortal={portal2} />}
      {portal2 && <Portal thisPortal={portal2} otherPortal={portal1} />}
    </>
  );
}
