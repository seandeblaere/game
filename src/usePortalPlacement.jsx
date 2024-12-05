import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

export function usePortalPlacement(onPortalPlace, portal1, portal2) {
  const { camera, scene } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [isPortal1Active, setIsPortal1Active] = useState(true);
  const [subscribeToKeys, getKeys] = useKeyboardControls();
  const radius = 1.5;
  const MIN_PORTAL_DISTANCE = radius * 2;

  const checkProximity = (portalType, newPortalPosition, faceNormal) => {
    const otherPortal = portalType === "portal1" ? portal2 : portal1;

    if (!otherPortal) return true;

    console.log(faceNormal, otherPortal.worldNormal);

    if (faceNormal.angleTo(otherPortal.worldNormal) > Math.PI * 0.01) {
      console.log("Normals are not aligned.");
      return true;
    }

    const worldPosition = new THREE.Vector3();
    otherPortal.parent.localToWorld(worldPosition.copy(otherPortal.position));

    console.log("checking distance");
    const distance = worldPosition.distanceTo(newPortalPosition);
    console.log(`Checking proximity: ${distance}`);
    console.log(distance > MIN_PORTAL_DISTANCE);
    return distance > MIN_PORTAL_DISTANCE;
  };

  const checkEdges = (position, faceNormal, boundingBox, radius) => {
    const { min, max } = boundingBox;

    if (faceNormal.x !== 0) {
      return (
        position.y - radius >= min.y &&
        position.y + radius <= max.y &&
        position.z - radius >= min.z &&
        position.z + radius <= max.z
      );
    } else if (faceNormal.y !== 0) {
      return (
        position.x - radius >= min.x &&
        position.x + radius <= max.x &&
        position.z - radius >= min.z &&
        position.z + radius <= max.z
      );
    } else if (faceNormal.z !== 0) {
      return (
        position.x - radius >= min.x &&
        position.x + radius <= max.x &&
        position.y - radius >= min.y &&
        position.y + radius <= max.y
      );
    }

    return false;
  };

  const placePortal = () => {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const filteredIntersections = intersects.filter((intersection) =>
      ["cube", "wall", "ground"].includes(intersection.object.name)
    );

    if (filteredIntersections.length > 0) {
      const firstIntersection = filteredIntersections[0];
      console.log(filteredIntersections);
      const { face, object, point } = firstIntersection;

      if (face && object && point) {
        const localPoint = object.worldToLocal(point.clone());
        console.log("local point: ", localPoint);
        const faceNormal = face.normal.clone();
        console.log("face normal: ", faceNormal);

        const boundingBox = object.geometry.boundingBox;
        console.log(boundingBox);

        const offsetPosition = localPoint.addScaledVector(faceNormal, 0.01);

        const portalType = isPortal1Active ? "portal1" : "portal2";

        const withinBounds = checkEdges(
          localPoint,
          faceNormal,
          boundingBox,
          radius
        );

        if (!withinBounds) return;

        const normalizeWorldNormal = (normal) => {
          const isCloseToZero = (value, epsilon = 1e-10) =>
            Math.abs(value) < epsilon;

          return new THREE.Vector3(
            isCloseToZero(normal.x) ? 0 : Math.sign(normal.x),
            isCloseToZero(normal.y) ? 0 : Math.sign(normal.y),
            isCloseToZero(normal.z) ? 0 : Math.sign(normal.z)
          );
        };

        const worldNormal = normalizeWorldNormal(
          faceNormal.applyQuaternion(object.quaternion).normalize()
        );

        const proximity = checkProximity(portalType, point, worldNormal);

        if (!proximity) return;

        onPortalPlace(
          portalType,
          object,
          offsetPosition,
          faceNormal,
          worldNormal
        );
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToKeys(({ switch: switchKey }) => {
      if (switchKey) {
        setIsPortal1Active((prev) => !prev);
      }
    });

    return () => unsubscribe();
  }, [subscribeToKeys, isPortal1Active]);

  return placePortal;
}
