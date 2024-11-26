import { useThree } from "@react-three/fiber";
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";

export function usePortalPlacement(onPortalPlace) {
  const { camera, scene } = useThree();
  const [raycaster] = useState(() => new THREE.Raycaster());
  const [isPortal1Active, setIsPortal1Active] = useState(true);
  const [subscribeToKeys, getKeys] = useKeyboardControls();

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

        console.log("Local Portal Position", localPoint);

        const faceNormal = face.normal.clone();

        const offsetPosition = localPoint.addScaledVector(faceNormal, 0.05);

        console.log("Offset Position", offsetPosition);

        const portalType = isPortal1Active ? "portal1" : "portal2";

        console.log("portal type:", portalType);

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
