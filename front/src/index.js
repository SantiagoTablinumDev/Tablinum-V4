import React from "react";
import ReactDOM from "react-dom/client"; // 👈 cambia aquí

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_es from "./translations/es/global.json";
import global_en from "./translations/en/global.json";

// Configuración de i18n
i18next.init({
  interpolation: { escapeValue: false },
  lng: navigator.language.substr(0, 2) === "es" ? "es" : "en",
  resources: {
    es: { global: global_es },
    en: { global: global_en },
  },
});

// Crear el root en React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain="dev-m9erqtpp.us.auth0.com"
    clientId="et4uk6mjxWuSgk6bSI954vwq5AotZlXA"
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          <Provider store={store}>
            <App />
          </Provider>
        </I18nextProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);

// Medir rendimiento
reportWebVitals();
