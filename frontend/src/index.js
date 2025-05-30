import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { OrdersContextProvider } from "./context/OrderContext";
import { WaitersContextProvider } from "./context/WaitersContext";
import { AdminContextProvider } from "./context/AdminContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AdminContextProvider>
      <OrdersContextProvider>
        <WaitersContextProvider>
          <App />
        </WaitersContextProvider>
      </OrdersContextProvider>
    </AdminContextProvider>
  </React.StrictMode>
);
