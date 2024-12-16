import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";

function VisibleEdges({
  color = "black",
  threshold,
  baseLineWidth = 4,
  far = 50,
  otherParent = false,
  parentPosition,
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
      edgeRef.current.material.linewidth = baseLineWidth / (distance * 1.2);
    }
  });

  return (
    <Edges
      ref={edgeRef}
      color={color}
      threshold={threshold}
      lineWidth={baseLineWidth}
    />
  );
}

export default VisibleEdges;
