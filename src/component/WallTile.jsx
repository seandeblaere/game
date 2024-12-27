import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function WallTile({ nodes, materials, position, shoot }) {
  const [isWallReady, setIsWallReady] = useState(false);
  const wallref = useRef();
  const [worldPosition, setWorldPosition] = useState(new THREE.Vector3());

  useEffect(() => {
    if (wallref.current) {
      const tempWorldPosition = new THREE.Vector3();
      wallref.current.getWorldPosition(tempWorldPosition);
      setWorldPosition(tempWorldPosition);
      setIsWallReady(true);
    }
  }, [wallref.current]);

  const color1 = shoot ? "#f5f3ed" : "#c4cef2";
  const color2 = shoot ? "#f5f3ed" : "#7baae8";
  return (
    <group dispose={null} position={position} rotation={[0, -Math.PI / 2, 0]}>
      <group scale={0.002}>
        <group position={[-50, 1182.895, 1366.193]} scale={1171.022}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["wallpanel02-col_Material005_0"].geometry}
            material={materials["Material.005"]}
            ref={wallref}
          >
            <ToonMaterial color={color1} />
            {isWallReady && (
              <VisibleEdges
                color="black"
                threshold={25}
                baseLineWidth={8}
                otherParent={true}
                parentPosition={worldPosition}
              />
            )}
          </mesh>

          <mesh
            castShadow
            receiveShadow
            geometry={nodes["wallpanel02-col_Material009_0"].geometry}
            material={materials["Material.009"]}
          >
            <ToonMaterial color={color2} />
            {isWallReady && (
              <VisibleEdges
                color="black"
                threshold={25}
                baseLineWidth={8}
                otherParent={true}
                parentPosition={worldPosition}
              />
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}

export function Wall({
  rows = 2,
  columns = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  shoot = false,
}) {
  const { nodes, materials } = useGLTF("../assets/sci-fi_wall_panels.glb");
  const tileSize = 4.24;
  const height = 4.69;

  const generateWallTiles = (shoot) => {
    const tiles = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const position = [0, i * height, j * tileSize];
        tiles.push(
          <WallTile
            key={`tile-${i}-${j}`}
            nodes={nodes}
            materials={materials}
            position={position}
            shoot={shoot}
          />
        );
      }
    }
    return tiles;
  };

  let wallShootRotation;
  let wallShootPosition;

  if (rotation[1] === -Math.PI / 2) {
    wallShootRotation = [0, Math.PI, 0];
    wallShootPosition = [
      tileSize / 2 - (tileSize * columns) / 2 + 0.1,
      (height * rows) / 2,
      -2.93,
    ];
  } else if (rotation[1] === Math.PI / 2) {
    wallShootRotation = [0, 0, 0];
    wallShootPosition = [
      -tileSize / 2 + (tileSize * columns) / 2 - 0.1,
      (height * rows) / 2,
      +2.93,
    ];
  } else if (rotation[1] === Math.PI) {
    wallShootRotation = [0, Math.PI / 2, 0];
    wallShootPosition = [
      +2.93,
      (height * rows) / 2,
      tileSize / 2 - (tileSize * columns) / 2 + 0.1,
    ];
  } else {
    wallShootRotation = [0, -Math.PI / 2, 0];
    wallShootPosition = [
      -2.93,
      (height * rows) / 2,
      -tileSize / 2 + (tileSize * columns) / 2 - 0.1,
    ];
  }

  return (
    <>
      <group position={position}>
        <RigidBody type="fixed" colliders="cuboid" rotation={rotation}>
          {generateWallTiles(shoot)}
        </RigidBody>
        {shoot && (
          <mesh
            name="wallShoot"
            rotation={wallShootRotation}
            position={wallShootPosition}
            visible={false}
          >
            <planeGeometry args={[tileSize * columns, height * rows]} />
          </mesh>
        )}
      </group>
    </>
  );
}

useGLTF.preload("../assets/sci-fi_wall_panels.glb");
