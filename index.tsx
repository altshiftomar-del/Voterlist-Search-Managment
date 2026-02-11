// @ts-nocheck
const { createRoot } = window.ReactDOM;
const { App } = window;
const React = window.React;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);