import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain=""
      clientId=""
      redirectUri="http://localhost:3000/dashboard"
      audience=""
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
