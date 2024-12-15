import * as THREE from "three";

const checkProximity = ({
  portalType,
  newPortalPosition,
  faceNormal,
  MIN_PORTAL_DISTANCE,
  portal1,
  portal2,
}) => {
  const otherPortal = portalType === "portal1" ? portal2 : portal1;

  if (!otherPortal) return true;

  if (faceNormal.angleTo(otherPortal.worldNormal) > Math.PI * 0.01) {
    return true;
  }

  const worldPosition = new THREE.Vector3();
  otherPortal.parent.localToWorld(worldPosition.copy(otherPortal.position));

  const distance = worldPosition.distanceTo(newPortalPosition);

  return distance > MIN_PORTAL_DISTANCE;
};

const checkEdges = ({ position, faceNormal, boundingBox, radius }) => {
  const { min, max } = boundingBox;

  const axis =
    Math.abs(faceNormal.x) > 0
      ? "x"
      : Math.abs(faceNormal.y) > 0
      ? "y"
      : Math.abs(faceNormal.z) > 0
      ? "z"
      : null;

  switch (axis) {
    case "x":
      return (
        position.y - radius >= min.y &&
        position.y + radius <= max.y &&
        position.z - radius >= min.z &&
        position.z + radius <= max.z
      );
    case "y":
      return (
        position.x - radius >= min.x &&
        position.x + radius <= max.x &&
        position.z - radius >= min.z &&
        position.z + radius <= max.z
      );
    case "z":
      return (
        position.x - radius >= min.x &&
        position.x + radius <= max.x &&
        position.y - radius >= min.y &&
        position.y + radius <= max.y
      );
    default:
      return false;
  }
};

const normalizeWorldNormal = (normal) => {
  const isCloseToZero = (value, epsilon = 1e-10) => Math.abs(value) < epsilon;

  return new THREE.Vector3(
    isCloseToZero(normal.x) ? 0 : Math.sign(normal.x),
    isCloseToZero(normal.y) ? 0 : Math.sign(normal.y),
    isCloseToZero(normal.z) ? 0 : Math.sign(normal.z)
  );
};

const useHelper = () => {
  return {
    checkProximity,
    checkEdges,
    normalizeWorldNormal,
  };
};

export default useHelper;
