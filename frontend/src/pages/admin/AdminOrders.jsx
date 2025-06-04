import { useState, useEffect } from "react"; // Import useEffect here
import { useOrdersContext } from "../../hooks/useOrdersContext";
import OrderDetails from "../../component/OrderDetails";
import React from "react";
import { useSocket } from "../../hooks/useSocket";
const AdminOrders = () => {
      useSocket();
  const { orders, dispatch } = useOrdersContext();
  const [waiter, setWaiter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch Orders
  useEffect(() => {
  
    const fetchOrders = async () => {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders`);
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ORDERS", payload: json });
        setIsLoading(false);
      } else {
        console.log("No data");
        setIsLoading(false);
      }
    };

      fetchOrders(); // Call the function within useEffect


    // return () => clearInterval(interval); // cleanup on unmount
  }, [dispatch]); // Ensure dispatch is added to dependency arra

  // Function to update an order
  const updateOrder = async (order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/${order._id}`,
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/${order._id}`,
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
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminOrders;
