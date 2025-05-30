import { useState, useEffect } from "react"; // Import useEffect here
import { useOrdersContext } from "../../hooks/useOrdersContext";
import OrderDetails from "../../component/OrderDetails";
import React from 'react';
const AdminOrders = () => {
  const { orders, dispatch } = useOrdersContext();
  const [waiter, setWaiter] = useState(false);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:4000/api/orders");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ORDERS", payload: json });
      } else {
        console.log("No data");
      }
    };

    fetchOrders(); // Call the function within useEffect
  }, [dispatch]); // Ensure dispatch is added to dependency arra

  // Function to update an order
  const updateOrder = async (order) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/orders/" + order._id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order), // Send updated order data
        }
      );
      const json = await response.json();

      if (response.ok) {
        // console.log("Order updated:", json);

        // Dispatch action to update the order in the state
        dispatch({ type: "UPDATE_ORDER", payload: json });
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // DELETE AN ORDER
  const deleteOrder = async (order) => {
    // Pass the waiter object here
    try {
      const response = await fetch(
        "http://localhost:4000/api/orders/" + order._id,
        {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (response.ok) {
        console.log("Waiter deleted:", json);
        dispatch({ type: "DELETE_ORDER", payload: order._id });
      }
    } catch (error) {
      console.error("Error deleting waiter:", error);
    }
  };

  return (
    <div>
      <OrderDetails
        updateOrder={updateOrder}
        deleteOrder={deleteOrder}
        orders={orders}
        waiter={waiter}
      />
    </div>
  );
};

export default AdminOrders;
