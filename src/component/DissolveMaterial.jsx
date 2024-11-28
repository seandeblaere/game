import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise";
import { easing } from "maath";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

export function DissolveMaterial({
  baseMaterial,
  thickness = 0.1,
  color = "#eb5a13",
  intensity = 50,
  duration = 0.5,
  dissolveKey,
}) {
  // Recreate shaders when dissolveKey changes
  const vertexShader = React.useMemo(() => {
    return `
      varying vec2 vUv; // Custom UV for fragment shader
      varying vec3 vPosition; // Custom position for fragment shader

      void main() {
        vUv = uv; // Pass UV to fragment shader
        vPosition = position; // Pass position to fragment shader

        csm_Position = position; // Use csm_Position for vertex position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // Standard projection
      }
    `;
  }, [dissolveKey]); // Recreate vertex shader when dissolveKey changes

  const fragmentShader = React.useMemo(() => {
    return patchShaders(`
      varying vec2 vUv; // UV from vertex shader
      varying vec3 vPosition; // Position from vertex shader
      uniform float uThickness;
      uniform vec3 uColor;
      uniform float uProgress;

      void main() {
        gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);

        // Use vPosition (or csm_Position) for world position-based noise
        float noise = gln_sfbm(vPosition, opts); // World position used for noise
        noise = gln_normalize(noise);

        float progress = uProgress;

        float alpha = step(1.0 - progress, noise);
        float border = step((1.0 - progress) - uThickness, noise) - alpha;

        csm_DiffuseColor.a = alpha + border;
        csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb, uColor, border);
      }
    `);
  }, [dissolveKey]);

  const uniforms = useRef({
    uThickness: { value: thickness },
    uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
    uProgress: { value: 0 },
  });

  useEffect(() => {
    uniforms.current.uProgress.value = 0;
    uniforms.current.uThickness.value = thickness;
    uniforms.current.uColor.value.set(color).multiplyScalar(intensity);
  }, [dissolveKey]);

  useFrame((_, delta) => {
    // Animate dissolve effect
    easing.damp(uniforms.current.uProgress, "value", 1, duration, delta);
  });

  return (
    <CSM
      baseMaterial={baseMaterial}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms.current}
      toneMapped={false}
      transparent
      key={dissolveKey}
    />
  );
}
