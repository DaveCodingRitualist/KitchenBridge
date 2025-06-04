// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

import { OrdersContextProvider } from "./context/OrderContext";
import { WaitersContextProvider } from "./context/WaitersContext";
import { AdminContextProvider } from "./context/AdminContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminContextProvider>
      <OrdersContextProvider>
        <WaitersContextProvider>
          <App />
        </WaitersContextProvider>
      </OrdersContextProvider>
    </AdminContextProvider>
  </React.StrictMode>
)
