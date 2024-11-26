import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
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

  const placePortal = usePortalPlacement(
    (portalType, object, localPosition, normal) => {
      if (portalType === "portal1") {
        setPortal1({ parent: object, position: localPosition, normal });
      } else if (portalType === "portal2") {
        setPortal2({ parent: object, position: localPosition, normal });
      }
    }
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
        new THREE.Vector3(0, 0, 0), // Player's "forward"
        cameraDirection, // Direction camera is facing
        new THREE.Vector3(0, 1, 0) // Up vector
      )
    );

    player.current.setRotation(playerQuaternion, true);

    const velocity = player.current.linvel();
    // update camera
    state.camera.position.copy(player.current.translation());

    // movement
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);
    player.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

    //jump
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
      {portal1 && (
        <Portal
          thisPortal={portal1}
          otherPortal={portal2}
          color="blue"
          name="Portal1"
        />
      )}
      {portal2 && (
        <Portal
          thisPortal={portal2}
          otherPortal={portal1}
          color="red"
          name="Portal2"
        />
      )}
    </>
  );
}
