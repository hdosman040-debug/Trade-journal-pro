import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./app/ErrorBoundary";
import "./styles/globals.css";

const rootEl = document.getElementById("root")!;

window.addEventListener("error", (e) => {
  rootEl.innerHTML = `<pre style="color:red;padding:16px;white-space:pre-wrap;font-size:12px;">${e.message}\n\n${e.error?.stack || ""}</pre>`;
});

window.addEventListener("unhandledrejection", (e) => {
  rootEl.innerHTML = `<pre style="color:red;padding:16px;white-space:pre-wrap;font-size:12px;">Unhandled Promise Rejection:\n${e.reason}</pre>`;
});

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (err: any) {
  rootEl.innerHTML = `<pre style="color:red;padding:16px;white-space:pre-wrap;font-size:12px;">${err.message}\n\n${err.stack}</pre>`;
}
