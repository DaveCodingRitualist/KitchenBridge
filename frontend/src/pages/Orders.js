import React from 'react';

import AdminOrders from './admin/AdminOrders';
import './Orders.css';
import { useState } from 'react'



const Orders = () => {
  
  return (
    <div className='waiters-section'>
      <AdminOrders />
    </div>
  );
}

export default Orders;
