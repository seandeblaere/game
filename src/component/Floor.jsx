import * as THREE from "three";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Floor({
  rows = 2,
  columns = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  shoot = false,
}) {
  const { nodes, materials } = useGLTF("/../assets/floortile.glb");

  const sharedGeometry = useMemo(
    () => nodes["EViRO_Kuby_��������_0"].geometry,
    [nodes]
  );
  const sharedMaterial = useMemo(() => materials.material, [materials]);

  const tilePositions = useMemo(() => {
    const positions = [];
    const tileSize = 1.5;
    const tileSpacing = 1.5;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        positions.push(
          new THREE.Vector3(
            j * (tileSize + tileSpacing),
            0,
            i * (tileSize + tileSpacing)
          )
        );
      }
    }
    return positions;
  }, [rows, columns]);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        {tilePositions.map((tilePosition, index) => (
          <FloorTile
            key={`tile-${index}`}
            position={tilePosition.toArray()}
            sharedGeometry={sharedGeometry}
            sharedMaterial={sharedMaterial}
          />
        ))}
      </RigidBody>
      {shoot && (
        <mesh
          name="groundShoot"
          position={[
            1.5 * columns - 1.5,
            0.054,
            1.5 * rows - 1.5, 
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <planeGeometry args={[3 * columns, 3 * rows]} />
        </mesh>
      )}
    </group>
  );
}

function FloorTile({ position, sharedGeometry, sharedMaterial }) {
  const floorRef = useRef();
  const [worldPosition, setWorldPosition] = useState(new THREE.Vector3());
  const [isFloorReady, setIsFloorReady] = useState(false);

  useEffect(() => {
    if (floorRef.current) {
      const tempWorldPosition = new THREE.Vector3();
      floorRef.current.getWorldPosition(tempWorldPosition);
      setWorldPosition(tempWorldPosition);
      setIsFloorReady(true);
    }
  }, [floorRef.current]);

  return (
    <group dispose={null} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <group scale={0.006}>
        <mesh
          castShadow
          receiveShadow
          geometry={sharedGeometry}
          material={sharedMaterial}
          position={[0, 0, -8.893]}
          ref={floorRef}
        >
          <ToonMaterial color={"#c4cef2"} />
          {isFloorReady && (
            <VisibleEdges
              color="black"
              threshold={40}
              baseLineWidth={5}
              otherParent={true}
              parentPosition={worldPosition}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/../assets/floortile.glb");
