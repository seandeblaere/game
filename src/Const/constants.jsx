export const KEYS = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "switch", keys: ["KeyF"] },
  { name: "pickUp", keys: ["KeyR"] },
];

export const CANVAS_PROPS = {
  gl: {
    stencil: false,
    powerPreference: "high-performance",
  },
  performance: { min: 0.3, max: 0.8 },
  shadows: true,
  camera: { fov: 45 },
  dpr: [0.5, 1],
};
