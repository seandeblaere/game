import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Sky, PointerLockControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./component/Ground";
import { Cube } from "./component/Cube";
import { Wall } from "./component/Wall";
import { Player } from "./Player";

const root = ReactDOM.createRoot(document.querySelector("#root"));

function Crosshair() {
  return <div className="crosshair" />;
}

root.render(
  <>
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "switch", keys: ["KeyF"] },
      ]}
    >
      <Canvas shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics debug gravity={[0, -15, 0]}>
          <Ground />
          <Player />
          <Cube />
          <Wall />
        </Physics>
        <PointerLockControls />
      </Canvas>
    </KeyboardControls>
    <Crosshair />
  </>
);
