import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import useHelper from "./usehelper";

export function usePortalPlacement(onPortalPlace, portal1, portal2) {
  const { camera, scene } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [isPortal1Active, setIsPortal1Active] = useState(true);
  const [subscribeToKeys] = useKeyboardControls();
  const radius = 1.5;
  const MIN_PORTAL_DISTANCE = radius * 2;
  const { checkProximity, checkEdges, normalizeWorldNormal } = useHelper();

  const placePortal = () => {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const filteredIntersections = intersects.filter((intersection) =>
      ["cubeShoot", "wallShoot", "groundShoot"].includes(
        intersection.object.name
      )
    );

    if (filteredIntersections.length > 0) {
      const firstIntersection = filteredIntersections[0];

      const { face, object, point } = firstIntersection;

      if (face && object && point) {
        const localPoint = object.worldToLocal(point.clone());

        const faceNormal = face.normal.clone();

        const boundingBox = object.geometry.boundingBox;

        const offsetPosition = localPoint.addScaledVector(faceNormal, 0.01);

        const portalType = isPortal1Active ? "portal1" : "portal2";

        const withinBounds = checkEdges({
          position: localPoint,
          faceNormal,
          boundingBox,
          radius,
        });

        if (!withinBounds) return;

        const worldNormal = normalizeWorldNormal(
          faceNormal.applyQuaternion(object.quaternion).normalize()
        );

        const proximity = checkProximity({
          portalType,
          newPortalPosition: point,
          faceNormal: worldNormal,
          MIN_PORTAL_DISTANCE,
          portal1,
          portal2,
        });

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
