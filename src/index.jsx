import "./style.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const root = ReactDOM.createRoot(document.querySelector("#root"));

function Crosshair() {
  return (
    <>
      <div className="crosshair" />
      <div className="crosshair2" />
    </>
  );
}

root.render(
  <>
    <App />
    <Crosshair />
  </>
);
