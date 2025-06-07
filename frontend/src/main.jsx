// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import NotificationListener from './component/NotificationListener.jsx'
import './index.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

import { OrdersContextProvider } from "./context/OrderContext";
import { WaitersContextProvider } from "./context/WaitersContext";
import { AdminContextProvider } from "./context/AdminContext";
import  { AuthContextProvider } from './context/AuthContext.jsx'
import { AttentionContextProvider } from './context/AttentionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AuthContextProvider>
    <AdminContextProvider>
      <OrdersContextProvider>
        <WaitersContextProvider>
        <AttentionContextProvider>
          <NotificationListener />
          <App />
        </AttentionContextProvider>
        </WaitersContextProvider>
      </OrdersContextProvider>
    </AdminContextProvider>
  </AuthContextProvider>
    
  </React.StrictMode>
)
