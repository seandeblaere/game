import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, quat, vec3, euler } from "@react-three/rapier";
import { PerspectiveCamera } from "@react-three/drei";

export function Portal({ thisPortal, otherPortal, color }) {
  const rigidBodyRef = useRef();
  const portalCameraRef = useRef();
  const renderTarget = useRef(new THREE.WebGLRenderTarget(1024, 1024));
  const { gl, scene, camera } = useThree();
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const aspect = renderTarget.current.width / renderTarget.current.height;
    if (portalCameraRef.current) {
      portalCameraRef.current.fov = camera.fov;
      portalCameraRef.current.aspect = aspect;
      portalCameraRef.current.near = camera.near;
      portalCameraRef.current.far = camera.far;
      portalCameraRef.current.updateProjectionMatrix();
    }
  }, [camera, portalCameraRef]);

  useEffect(() => {
    // Clean up the render target when the portal is unmounted
    return () => renderTarget.current.dispose();
  }, []);

  useFrame(() => {
    if (rigidBodyRef.current) {
      // Recalculate world position of the portal based on the moving parent
      const worldPosition = new THREE.Vector3();
      thisPortal.parent.localToWorld(worldPosition.copy(thisPortal.position));

      // Recalculate rotation quaternion based on the normal vector
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        thisPortal.normal
      );

      // Update position and rotation of the physics body
      rigidBodyRef.current.setTranslation(worldPosition, true);
      rigidBodyRef.current.setRotation(quaternion, true);
    }

    if (!otherPortal || !portalCameraRef.current) return;

    // Position the portal camera at the other portal
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

    // Render the scene from the portal camera's perspective
    gl.setRenderTarget(renderTarget.current);
    gl.clear(); // Clear previous frame
    gl.render(scene, portalCameraRef.current);
    gl.setRenderTarget(null); // Reset render target
  });

  let entryQuaternion = new THREE.Quaternion(); // Store entry portal rotation

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

    // Calculate world position and rotation of the exit portal
    const { parent, position, normal } = otherPortal;
    const worldPosition = new THREE.Vector3();
    parent.localToWorld(worldPosition.copy(position));

    const exitQuaternion = new THREE.Quaternion();
    exitQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), normal);

    // Calculate the player's rotation difference relative to the entry portal
    const entryPortalQuaternion = new THREE.Quaternion();
    const entryPortalNormal = thisPortal.normal;
    entryPortalQuaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      entryPortalNormal
    );

    const playerCameraQuaternion = camera.quaternion.clone(); // Get current camera rotation
    const relativeQuaternion = new THREE.Quaternion()
      .copy(entryPortalQuaternion)
      .invert()
      .multiply(playerCameraQuaternion); // Difference between player and portal

    // Apply the half rotation flip (180 degrees around Y-axis)
    const flipQuaternion = new THREE.Quaternion();
    flipQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

    // Final exit rotation = exit portal rotation + relative rotation + 180° flip
    const finalExitQuaternion = new THREE.Quaternion()
      .copy(exitQuaternion)
      .multiply(flipQuaternion)
      .multiply(relativeQuaternion);

    // Position offset in portal normal direction
    const offset = new THREE.Vector3().copy(normal).multiplyScalar(0.6);
    const finalPosition = worldPosition.add(offset);

    // Apply the final position and rotation to the player
    playerRigidBody.setTranslation(finalPosition, true);
    camera.quaternion.copy(finalExitQuaternion);
  };

  return (
    <>
      <RigidBody
        sensor
        ref={rigidBodyRef}
        type="fixed"
        colliders="cuboid"
        onIntersectionEnter={(payload) => teleportPlayer(payload)}
      >
        <group>
          <mesh>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial
              map={renderTarget.current.texture}
              toneMapped={false}
            />
          </mesh>
        </group>
      </RigidBody>
      <PerspectiveCamera
        ref={portalCameraRef}
        near={0.1}
        far={100}
        fov={75}
        aspect={1}
      />
    </>
  );
}
