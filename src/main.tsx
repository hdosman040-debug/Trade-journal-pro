import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./app/ErrorBoundary";
import "./styles/globals.css";
import eruda from "eruda";
eruda.init();
// Force Eruda's entry button above app UI and to a guaranteed-visible spot
setTimeout(() => {
  const btn = document.querySelector("#eruda") as HTMLElement | null;
  if (btn) {
    btn.style.zIndex = "999999";
  }
  const entryBtn = document.querySelector(".eruda-entry-btn") as HTMLElement | null;
  if (entryBtn) {
    entryBtn.style.top = "10px";
    entryBtn.style.bottom = "auto";
    entryBtn.style.right = "10px";
    entryBtn.style.zIndex = "999999";
  }
}, 500);

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
