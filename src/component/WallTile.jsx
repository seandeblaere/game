import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { ToonMaterial } from "../material/ToonMaterial";
import VisibleEdges from "../material/Edges";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function WallTile({ nodes, materials, position }) {
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
            <ToonMaterial color={"#a3a7b5"} />
            {isWallReady && (
              <VisibleEdges
                color="black"
                threshold={25}
                baseLineWidth={10}
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
            <ToonMaterial color={"#a3a7b5"} />
            {isWallReady && (
              <VisibleEdges
                color="black"
                threshold={25}
                baseLineWidth={10}
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

export function Wall() {
  const { nodes, materials } = useGLTF("../assets/sci-fi_wall_panels.glb");

  return (
    <>
      <group position={[-7, 0, 0]} rotation={[0, -Math.PI, 0]}>
        <group position={[0, 0, 0]}>
          <WallTile nodes={nodes} materials={materials} position={[0, 0, 0]} />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -8.48]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -12.72]}
          />
        </group>
        <group position={[0, 4.69, 0]}>
          <WallTile nodes={nodes} materials={materials} position={[0, 0, 0]} />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -8.48]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -12.72]}
          />
        </group>
      </group>
      <group position={[7, 0, 0]}>
        <group position={[0, 0, 0]}>
          <WallTile nodes={nodes} materials={materials} position={[0, 0, 0]} />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 8.48]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 12.72]}
          />
        </group>
        <group position={[0, 4.69, 0]}>
          <WallTile nodes={nodes} materials={materials} position={[0, 0, 0]} />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, -4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 4.24]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 8.48]}
          />
          <WallTile
            nodes={nodes}
            materials={materials}
            position={[0, 0, 12.72]}
          />
        </group>
      </group>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          name="wallShoot"
          rotation={[0, Math.PI / 2, 0]}
          position={[-4.07, 4.7, 4.3]}
          visible={false}
        >
          <planeGeometry args={[21.1, 9.3]} />
          <ToonMaterial color={"yellow"} />
          <VisibleEdges color="black" threshold={15} baseLineWidth={15} />
        </mesh>
      </RigidBody>
    </>
  );
}

useGLTF.preload("../assets/sci-fi_wall_panels.glb");
