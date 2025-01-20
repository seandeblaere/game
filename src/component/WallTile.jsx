import * as THREE from "three";
import React, { useRef, useEffect, useMemo } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Wall({
  rows = 2,
  columns = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  shoot = false,
}) {
  const { nodes, materials } = useGLTF("../assets/sci-fi_wall_panels.glb");

  const sharedGeometries = useMemo(
    () => ({
      geometry1: nodes["wallpanel02-col_Material005_0"].geometry,
      geometry2: nodes["wallpanel02-col_Material009_0"].geometry,
    }),
    [nodes]
  );

  const sharedMaterials = useMemo(
    () => ({
      material1: materials["Material.005"],
      material2: materials["Material.009"],
    }),
    [materials]
  );

  const tilePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        positions.push(new THREE.Vector3(0, i * 4.69, j * 4.24));
      }
    }
    return positions;
  }, []);

  const { wallShootRotation, wallShootPosition } = useMemo(() => {
    if (rotation[1] === -Math.PI / 2) {
      return {
        wallShootRotation: [0, Math.PI, 0],
        wallShootPosition: [
          4.24 / 2 - (4.24 * columns) / 2 + 0.1,
          (4.69 * rows) / 2,
          -2.93,
        ],
      };
    } else if (rotation[1] === Math.PI / 2) {
      return {
        wallShootRotation: [0, 0, 0],
        wallShootPosition: [
          -4.24 / 2 + (4.24 * columns) / 2 - 0.1,
          (4.69 * rows) / 2,
          +2.93,
        ],
      };
    } else if (rotation[1] === Math.PI) {
      return {
        wallShootRotation: [0, Math.PI / 2, 0],
        wallShootPosition: [
          +2.93,
          (4.69 * rows) / 2,
          4.24 / 2 - (4.24 * columns) / 2 + 0.1,
        ],
      };
    } else {
      return {
        wallShootRotation: [0, -Math.PI / 2, 0],
        wallShootPosition: [
          -2.93,
          (4.69 * rows) / 2,
          -4.24 / 2 + (4.24 * columns) / 2 - 0.1,
        ],
      };
    }
  }, []);

  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="cuboid" rotation={rotation}>
        <group>
          {tilePositions.map((tilePosition, index) => (
            <WallTile
              key={`tile-${index}`}
              position={tilePosition.toArray()}
              shoot={shoot}
              sharedGeometries={sharedGeometries}
              sharedMaterials={sharedMaterials}
            />
          ))}
        </group>
      </RigidBody>

      {shoot && (
        <mesh
          name="wallShoot"
          rotation={wallShootRotation}
          position={wallShootPosition}
          visible={false}
        >
          <planeGeometry args={[4.24 * columns, 4.69 * rows]} />
        </mesh>
      )}
    </group>
  );
}

function WallTile({ position, shoot, sharedGeometries }) {
  const wallRef = useRef();
  const [worldPosition, setWorldPosition] = React.useState(new THREE.Vector3());
  const [isWallReady, setIsWallReady] = React.useState(false);

  const color1 = shoot ? "#f5f3ed" : "#c4cef2";
  const color2 = shoot ? "#f5f3ed" : "#7baae8";

  useEffect(() => {
    if (wallRef.current) {
      const tempWorldPosition = new THREE.Vector3();
      wallRef.current.getWorldPosition(tempWorldPosition);
      setWorldPosition(tempWorldPosition);
      setIsWallReady(true);
    }
  }, []);

  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      <group scale={0.002}>
        <group position={[-50, 1182.895, 1366.193]} scale={1171.022}>
          <mesh
            castShadow
            receiveShadow
            geometry={sharedGeometries.geometry1}
            ref={wallRef}
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
          <mesh castShadow receiveShadow geometry={sharedGeometries.geometry2}>
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

useGLTF.preload("../assets/sci-fi_wall_panels.glb");
