import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { OrdersContextProvider } from './context/OrderContext'
import { WaitersContextProvider } from './context/WaitersContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <OrdersContextProvider>
  <WaitersContextProvider>
    <App />
  </WaitersContextProvider>
  </OrdersContextProvider>
  </React.StrictMode>
);


