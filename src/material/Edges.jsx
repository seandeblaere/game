import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

function VisibleEdges({
  color = "black",
  threshold,
  baseLineWidth = 4,
  far = 50,
  otherParent = false,
  parentPosition = new THREE.Vector3(0, 0, 0),
}) {
  const edgeRef = useRef();

  useFrame(({ camera }) => {
    if (!edgeRef.current) return;

    let distance = camera.position.distanceTo(edgeRef.current.parent.position);

    if (otherParent) {
      distance = camera.position.distanceTo(parentPosition);
    }

    if (distance > far) {
      edgeRef.current.visible = false;
    } else {
      edgeRef.current.visible = true;
      const proportionalWidth = baseLineWidth / (distance * 1.2);

      edgeRef.current.material.linewidth = otherParent
        ? Math.min(proportionalWidth, baseLineWidth / 4)
        : proportionalWidth;
    }
  });

  return (
    <Edges
      ref={edgeRef}
      color={color}
      threshold={threshold}
      lineWidth={baseLineWidth}
      layers={3}
    />
  );
}

export default VisibleEdges;
