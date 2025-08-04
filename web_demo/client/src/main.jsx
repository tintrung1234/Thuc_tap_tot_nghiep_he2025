import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "aos/dist/aos.css";
import AOS from "aos";

AOS.init({
  duration: 600,
  easing: "ease-in-out",
  once: false, // Animate only once when scrolled into view
  offset: 100, // Trigger animation 100px before element is in view
  throttleDelay: 50, // Reduce animation check frequency
});

createRoot(document.getElementById("root")).render(<App />);
