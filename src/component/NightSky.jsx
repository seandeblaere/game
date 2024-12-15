import { Sky, Stars } from "@react-three/drei";

export function NightSky() {
  return (
    <>
      <Sky
        sunPosition={[0, -1, 0]}
        rayleigh={10}
        turbidity={40}
        mieCoefficient={0.1}
        mieDirectionalG={5}
      />
      <Stars
        radius={100}
        depth={45}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </>
  );
}
