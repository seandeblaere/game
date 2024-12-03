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
import { easing } from "maath";

export function Portal({ thisPortal, otherPortal, dpr }) {
  const rigidBodyRef = useRef();
  const portalCameraRef = useRef();
  const mesh = useRef();
  const renderTarget = useFBO({
    stencilBuffer: false,
    resolution: 32 * dpr,
  });
  const { camera } = useThree();
  const [cooldown, setCooldown] = useState(false);
  const bRef = useRef(0.5);
  const gRef = useRef(0.5);
  const material = useRef();
  const [btarget, setBTarget] = useState(1);
  const [gtarget, setGTarget] = useState(1);

  useFrame((_, delta) => {
    if (Math.abs(bRef.current - btarget) < 0.01) {
      setBTarget(btarget === 1 ? 0 : 1); // Toggle the target between 0 and 1
    }
    // Smoothly interpolate valueRef.current towards the target
    bRef.current = THREE.MathUtils.lerp(bRef.current, btarget, delta * 0.5);

    material.current.material.color.b = bRef.current;
  });

  useFrame((_, delta) => {
    if (Math.abs(gRef.current - gtarget) < 0.01) {
      setGTarget(gtarget === 1 ? 0 : 1); // Toggle the target between 0 and 1
    }
    // Smoothly interpolate valueRef.current towards the target
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
    // Check if the colliding object is the player
    const isPlayer = payload.other.rigidBodyObject?.name === "Player";
    if (!isPlayer || !otherPortal) {
      console.log("No other portal");
      return; // If not the player or there is no destination portal, do nothing
    }

    // Prevent multiple teleports in quick succession using a cooldown
    if (cooldown) return;

    setCooldown(true); // Activate the cooldown
    setTimeout(() => setCooldown(false), 5000); // Cooldown lasts for 500ms

    // Get the player's rigid body, which is used to control their physics properties
    const playerRigidBody = payload.other.rigidBody;

    // Extract the parent, position, and normal of the exit portal
    const { parent, position, normal } = otherPortal;

    // Compute the world position of the exit portal
    const worldPosition = new THREE.Vector3();
    parent.localToWorld(worldPosition.copy(position)); // Transform local position to world coordinates

    // Debug: Log the vertical component of the portal normals for analysis
    if (thisPortal.normal.y === 0 && normal.y === 0) {
      // Create a quaternion that represents the rotation of the exit portal
      const exitQuaternion = new THREE.Quaternion();
      exitQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Local forward vector
        normal // Exit portal's normal vector (indicates its "forward" direction)
      );

      console.log(exitQuaternion);

      // Create a quaternion that represents the rotation of the entry portal
      const entryPortalQuaternion = new THREE.Quaternion();
      const entryPortalNormal = thisPortal.normal;
      entryPortalQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Local forward vector
        entryPortalNormal // Entry portal's normal vector
      );

      console.log(entryPortalQuaternion);

      // Capture the current rotation of the camera (the player's view)
      const playerCameraQuaternion = camera.quaternion.clone();

      // Calculate the relative rotation from the entry portal to the camera's orientation
      const relativeQuaternion = new THREE.Quaternion()
        .copy(entryPortalQuaternion)
        .invert() // Invert the entry portal's rotation to get the relative offset
        .multiply(playerCameraQuaternion); // Combine with the player's current rotation

      // Create a quaternion for a 180-degree flip (used for portals to maintain proper facing)
      const flipQuaternion = new THREE.Quaternion();
      flipQuaternion.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0), // Y-axis rotation (horizontal flip)
        Math.PI // Rotate by 180 degrees
      );

      // Combine the exit portal's rotation, the flip, and the relative rotation
      const finalExitQuaternion = new THREE.Quaternion()
        .copy(exitQuaternion) // Start with the exit portal's orientation
        .multiply(flipQuaternion) // Apply the flip
        .multiply(relativeQuaternion); // Apply the player's relative rotation

      // Compute a small offset to ensure the player doesn't get stuck in the portal
      const offset = new THREE.Vector3()
        .copy(normal) // Use the portal's normal to determine the direction of the offset
        .multiplyScalar(0.6); // Offset by 0.6 units along the normal

      // Calculate the final position for the player after teleportation
      const finalPosition = worldPosition.add(offset); // Add the offset to the exit portal's position

      // Teleport the player to the final position
      playerRigidBody.setTranslation(finalPosition, true); // Update the player's position
      // Update the player's camera rotation to match the final computed orientation
      camera.quaternion.copy(finalExitQuaternion);
    }

    if (thisPortal.normal.y === 0 && normal.y !== 0) {
      const entryQuaternion = new THREE.Quaternion();
      entryQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Local forward vector
        thisPortal.normal // Exit portal's normal vector (indicates its "forward" direction)
      );

      const playerCameraQuaternion = camera.quaternion.clone();

      const relativeQuaternion = new THREE.Quaternion()
        .copy(entryQuaternion)
        .invert() // Invert the entry portal's rotation to get the relative offset
        .multiply(playerCameraQuaternion);

      // Combine the exit portal's rotation, the flip, and the relative rotation
      const finalExitQuaternion = new THREE.Quaternion()
        .copy(entryQuaternion) // Start with the exit portal's orientation
        .multiply(relativeQuaternion);

      // Compute a small offset to ensure the player doesn't get stuck in the portal
      const offset = new THREE.Vector3()
        .copy(normal) // Use the portal's normal to determine the direction of the offset
        .multiplyScalar(4); // Offset by 0.6 units along the normal

      // Calculate the final position for the player after teleportation
      const finalPosition = worldPosition.add(offset);

      playerRigidBody.setTranslation(finalPosition, true);
      camera.quaternion.copy(finalExitQuaternion);
    }

    if (thisPortal.normal.y !== 0 && normal.y === 0) {
      console.log("test");
      const exitQuaternion = new THREE.Quaternion();
      exitQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Local forward vector
        normal // Exit portal's normal vector (indicates its "forward" direction)
      );

      const playerCameraQuaternion = camera.quaternion.clone();

      const relativeQuaternion = new THREE.Quaternion()
        .copy(exitQuaternion)
        .invert() // Invert the entry portal's rotation to get the relative offset
        .multiply(playerCameraQuaternion);

      console.log(relativeQuaternion);

      // Combine the exit portal's rotation, the flip, and the relative rotation
      const finalExitQuaternion = new THREE.Quaternion()
        .copy(exitQuaternion) // Start with the exit portal's orientation
        .multiply(relativeQuaternion);

      // Compute a small offset to ensure the player doesn't get stuck in the portal
      const offset = new THREE.Vector3()
        .copy(normal) // Use the portal's normal to determine the direction of the offset
        .multiplyScalar(0.6); // Offset by 0.6 units along the normal

      // Calculate the final position for the player after teleportation
      const finalPosition = worldPosition.add(offset);

      playerRigidBody.setTranslation(finalPosition, true);
      camera.quaternion.copy(finalExitQuaternion);
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
              <circleGeometry args={[1.2, 32]} />
              <meshStandardMaterial />
            </mesh>
          </MeshCollider>

          <mesh ref={material} layers={thisPortal.name == "portal1" ? 1 : 2}>
            <circleGeometry args={[1.2, 32]} />
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
