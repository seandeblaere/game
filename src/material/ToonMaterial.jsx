import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import TOON_TONE from "../assets/textures/fiveTone.jpg";

export function ToonMaterial({ color = "#FFFFFF", ...props }) {
  const rawTexture = useLoader(THREE.TextureLoader, TOON_TONE);

  const texture = useMemo(() => {
    rawTexture.minFilter = rawTexture.magFilter = THREE.NearestFilter;
    return rawTexture;
  }, [rawTexture]);

  return <meshToonMaterial color={color} gradientMap={texture} {...props} />;
}
