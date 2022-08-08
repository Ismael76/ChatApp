import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //Remove ReactStrict mode component as it renders components twice!
  <App />
);

reportWebVitals();
