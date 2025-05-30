
import "./Admin.css";
import OrderForm from "./OrderForm";
import AdminOrders from "./AdminOrders";
import { useOrdersContext } from "../../hooks/useOrdersContext";
import React from 'react';
const Admin = () => {
  return (
    <div className="admin">
      <AdminOrders/>
       <OrderForm/>  
    </div>
  );
};

export default Admin;
