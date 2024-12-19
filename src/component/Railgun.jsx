import React from "react";
import { useGLTF, Edges } from "@react-three/drei";
import { ToonMaterial } from "../material/ToonMaterial";

export function Gun(props) {
  const { nodes, materials } = useGLTF("../assets//stylized_gun.glb");

  const toonMesh = (geometry, position, rotation, color) => (
    <mesh
      layers={3}
      receiveShadow
      geometry={geometry}
      position={position}
      rotation={rotation}
    >
      <ToonMaterial color={color} />
      <Edges linewidth={1} threshold={30} color="black" layers={3} />
    </mesh>
  );

  return (
    <group {...props} dispose={null} scale={0.1} layers={3}>
      {toonMesh(
        nodes.Object_4.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#A2D5F2"
      )}
      {toonMesh(
        nodes.Object_6.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#F28FAD"
      )}
      {toonMesh(
        nodes.Object_8.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#F7B267"
      )}
      {toonMesh(
        nodes.Object_10.geometry,
        [0, 0.716, -0.218],
        [-Math.PI / 2, 0, 0],
        "#85C7F2"
      )}
      {toonMesh(
        nodes.Object_12.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#6D98BA"
      )}
      {toonMesh(
        nodes.Object_14.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#E2856E"
      )}
      {toonMesh(
        nodes.Object_16.geometry,
        [0, -1.471, -3.499],
        [0.272, 0, 0],
        "#A7C7E7"
      )}
      {toonMesh(
        nodes.Object_18.geometry,
        [0, -1.471, -3.499],
        [0.272, 0, 0],
        "#FFB6C1"
      )}
      {toonMesh(
        nodes.Object_20.geometry,
        [0, -0.311, 2.111],
        [-Math.PI / 2, 0, 0],
        "#FFFACD"
      )}
      {toonMesh(
        nodes.Object_22.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FFA07A"
      )}
      {toonMesh(
        nodes.Object_24.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#87CEFA"
      )}
      {toonMesh(
        nodes.Object_26.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#98FB98"
      )}
      {toonMesh(
        nodes.Object_28.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FFDAB9"
      )}
      {toonMesh(
        nodes.Object_30.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FF7F50"
      )}
      {toonMesh(
        nodes.Object_32.geometry,
        [0, 0.735, -0.193],
        [-Math.PI / 2, 0, 0],
        "#E0FFFF"
      )}
      {toonMesh(
        nodes.Object_34.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FFE4E1"
      )}
      {toonMesh(
        nodes.Object_36.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FAFAD2"
      )}
      {toonMesh(
        nodes.Object_38.geometry,
        [0, -1.471, -3.499],
        [0.272, 0, 0],
        "#D3D3D3"
      )}
      {toonMesh(
        nodes.Object_40.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#ADD8E6"
      )}
      {toonMesh(
        nodes.Object_42.geometry,
        [0, 0.748, -0.218],
        [-Math.PI / 2, 0, 0],
        "#F08080"
      )}
      {toonMesh(
        nodes.Object_44.geometry,
        [0.103, 0.05, 0],
        [0, 0, -1.625],
        "#E6E6FA"
      )}
      {toonMesh(
        nodes.Object_46.geometry,
        [0, 0.716, -0.218],
        [-Math.PI / 2, 0, 0],
        "#FFF0F5"
      )}
    </group>
  );
}

useGLTF.preload("../assets/stylized_gun.glb");
