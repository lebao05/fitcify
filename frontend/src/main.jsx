import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store.js"; // make sure this file exists

import "./index.css";
import App from "./App.jsx";
import { PlayerProvider } from "./context/PlayerContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </Provider>
  </StrictMode>
);
