import * as THREE from "three";

const animateMaterialColor = ({
  ref,
  targetState,
  setTargetState,
  materialRef,
  colorProperty,
  delta,
  speed,
}) => {
  if (Math.abs(ref.current - targetState) < 0.01) {
    setTargetState(targetState === 1 ? 0 : 1);
  }

  ref.current = THREE.MathUtils.lerp(ref.current, targetState, delta * speed);
  materialRef.current.material.color[colorProperty] = ref.current;
};

export default animateMaterialColor;
