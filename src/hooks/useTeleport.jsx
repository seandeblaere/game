import * as THREE from "three";
import { velocity } from "three/webgpu";

const useTeleport = ({ playerName = "Player", camera }) => {
  const teleportPlayer = ({
    payload,
    otherPortal,
    thisPortal,
    sharedCooldown,
  }) => {
    const isPlayer = payload.other.rigidBodyObject?.name === playerName;
    const isCube = payload.other.rigidBodyObject?.name === "Box";
    if (!(isPlayer || isCube) || !otherPortal) {
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

      const newVelocity = new THREE.Vector3()
        .copy(worldNormal)
        .multiplyScalar(speed);

      playerRigidBody.setLinvel(newVelocity, true);
      if (isPlayer) {
        camera.quaternion.copy(finalQuaternion);
      }
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

  return { teleportPlayer };
};

export default useTeleport;
