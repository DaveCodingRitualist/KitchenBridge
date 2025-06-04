import { useState, useEffect } from "react";
import { useOrdersContext } from "../../hooks/useOrdersContext";
import OrderDetails from "../../component/OrderDetails";
import React from "react";
import { useSocket } from "../../hooks/useSocket";

const AdminOrders = () => {
  const socket = useSocket(); // Get socket connection
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
      } else {
        console.log("No data");
      }
      setIsLoading(false);
    };
      fetchOrders();
 
  }, [dispatch]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("orderCreated", (newOrder) => {
      dispatch({ type: "CREATE_ORDER", payload: newOrder });
    });

    socket.on("orderUpdated", (updatedOrder) => {
      dispatch({ type: "UPDATE_ORDER", payload: updatedOrder });
    });

    socket.on("orderDeleted", (deletedId) => {
      dispatch({ type: "DELETE_ORDER", payload: deletedId });
    });

    socket.on("chatUpdated", (updatedOrder) => {
      dispatch({ type: "UPDATE_ORDER", payload: updatedOrder });
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
      socket.off("orderDeleted");
      socket.off("chatUpdated");
    };
  }, [socket, dispatch]);

  // Update an order
  const updateOrder = async (order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/${order._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        }
      );
      const json = await response.json();

      if (!response.ok) {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Delete an order
  const deleteOrder = async (order) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/${order._id}`,
        {
          method: "DELETE",
        }
      );
      const json = await response.json();

      if (!response.ok) {
        console.error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
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
