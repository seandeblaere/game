import * as THREE from "three";

const animateGun = ({ gun, isMoving, grounded, state, cameraDirection }) => {
  if (!gun || !gun.current || !gun.current.children || !gun.current.children[0])
    return;

  const gunPart = gun.current.children[0];
  const elapsedTime = state.clock.elapsedTime;

  gunPart.rotation.z = THREE.MathUtils.lerp(
    gunPart.rotation.z,
    Math.sin(isMoving * grounded * elapsedTime * 7) / 30,
    0.1
  );

  gunPart.position.x = THREE.MathUtils.lerp(
    gunPart.position.x,
    Math.sin(isMoving * grounded * elapsedTime * 7) / 45 + 0.25,
    0.1
  );

  gunPart.rotation.x = THREE.MathUtils.lerp(
    gunPart.rotation.x,
    !grounded ? 0.12 : 0,
    0.07
  );

  gunPart.position.z = THREE.MathUtils.lerp(gunPart.position.z, 0.33, 0.5);

  gun.current.rotation.copy(state.camera.rotation);
  gun.current.position
    .copy(state.camera.position)
    .add(cameraDirection.multiplyScalar(1));
};

export default animateGun;
