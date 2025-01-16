import "./style.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { useState, useEffect } from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

function Overlay() {
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [menu, setMenu] = useState(false);
  const [gameKey, setGameKey] = useState(Date.now());

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "p" || event.key === "P") {
        setMenu((prevMenu) => !prevMenu);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleStart = () => {
    setReady(true);
    setFinished(false);
  };

  const handleRestart = () => {
    setReady(true);
    setFinished(false);
    setGameKey(Date.now());
  };

  const handleContinue = () => {
    setMenu(false);
  };

  return (
    <>
      <App setFinished={setFinished} key={gameKey} />
      {!ready && !menu && (
        <div className="fullscreen bg notready">
          <h1>Portal Runner</h1>

          <div className="button-container">
            <button onClick={handleStart} className="button-49">
              Start
            </button>
          </div>
          <h3>Press p to show controls menu</h3>
        </div>
      )}

      {finished && (
        <div className="fullscreen bg notready">
          <h1>Level completed!</h1>
          <div className="button-container">
            <button onClick={handleRestart} className="button-49">
              Restart
            </button>
          </div>
        </div>
      )}
      {menu && (
        <div className="fullscreen bg notready">
          <h2>Game Instructions</h2>
          <div className="controls">
            <h3>Controls:</h3>
            <ul>
              <li>
                <strong>Z, S, Q, D</strong> - Move (Z = forward, S = backward, Q
                = left, D = right)
              </li>
              <li>
                <strong>Spacebar</strong> - Jump
              </li>
              <li>
                <strong>Click</strong> - Shoot portal
              </li>
              <li>
                <strong>F</strong> - Switch portal
              </li>
              <li>
                <strong>R</strong> - Pick up cube
              </li>
            </ul>
          </div>

          <div className="gameplay-rules">
            <h3>Gameplay Rules:</h3>
            <ul>
              <li>
                <strong>Portals</strong> can only be shot at white surfaces.
              </li>
              <li>
                <strong>Portal Placement</strong> must be within the bounds of a
                surface. If the portal is placed over an edge, it will not
                trigger.
              </li>
              <li>
                Your <strong>velocity</strong> at the moment of shooting a
                portal will be transferred to the outgoing portal. This means
                momentum is conserved as you pass through!
              </li>
              <li>
                Use the<strong>Launchpad</strong> to jump really high!
              </li>
              <li>Cubes can also pass through portals, even on their own!</li>
            </ul>
          </div>

          <div className="button-container">
            <button onClick={handleContinue} className="button-49">
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="crosshair" />
      <div className="crosshair2" />
    </>
  );
}

root.render(<Overlay />);
