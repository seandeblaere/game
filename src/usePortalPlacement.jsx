import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

export function usePortalPlacement(onPortalPlace, portal1, portal2) {
  const { camera, scene } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [isPortal1Active, setIsPortal1Active] = useState(true);
  const [subscribeToKeys, getKeys] = useKeyboardControls();

  const MIN_PORTAL_DISTANCE = 2.4;

  const checkProximity = (portalType, newPortalPosition) => {
    const currentPortal1 = portal1;
    const currentPortal2 = portal2;

    if (portalType === "portal1" && currentPortal2) {
      console.log("checking portal 1");
      const distance = currentPortal2.position.distanceTo(newPortalPosition);
      console.log(distance);
      return distance > MIN_PORTAL_DISTANCE;
    } else if (portalType === "portal2" && currentPortal1) {
      console.log("checking portal 2");
      const distance = currentPortal1.position.distanceTo(newPortalPosition);
      console.log(distance);
      return distance > MIN_PORTAL_DISTANCE;
    }
    console.log("first portal");
    return true;
  };

  const placePortal = () => {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const filteredIntersections = intersects.filter((intersection) =>
      ["cube", "wall"].includes(intersection.object.name)
    );

    if (filteredIntersections.length > 0) {
      const firstIntersection = filteredIntersections[0];
      const { face, object, point } = firstIntersection;

      if (face && object) {
        const localPoint = object.worldToLocal(point.clone());
        const faceNormal = face.normal.clone();

        const offsetPosition = localPoint.addScaledVector(faceNormal, 0.05);

        const portalType = isPortal1Active ? "portal1" : "portal2";

        const proximity = checkProximity(portalType, offsetPosition);
        if (!proximity) return;

        onPortalPlace(portalType, object, offsetPosition, faceNormal);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToKeys(({ switch: switchKey }) => {
      if (switchKey) {
        setIsPortal1Active((prev) => !prev);
        console.log(
          "Switched portal type:",
          isPortal1Active ? "portal2" : "portal1"
        );
      }
    });

    return () => unsubscribe();
  }, [subscribeToKeys, isPortal1Active]);

  return placePortal;
}
