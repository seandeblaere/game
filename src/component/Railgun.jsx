import { useGLTF } from "@react-three/drei";
import gunUrl from "../assets/rail_gun.glb";

export default function RailGun(props) {
  const { scene } = useGLTF(gunUrl);

  return (
    <group dispose={null} {...props}>
      <primitive
        object={scene}
        rotation={[0, Math.PI / 1.8, -0.3]}
        scale={0.5}
      />
    </group>
  );
}

useGLTF.preload(gunUrl);
