import { useState, useEffect } from "react"; // Import useEffect here
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useOrdersContext } from "../../hooks/useOrdersContext";
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
  }, [dispatch]); // Ensure dispatch is added to dependency array

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
    <div className="container">
      {orders.map((order, index) => (
        <div
          className={`${order.status === "Ready" ? "ready" : "orders-list"}`}
          key={index}
        >
          {console.log(order.status)}
          <div className="orders-details">
            <div className="order-titles">
              <div className="table">
                <div className="table">
                  <span>
                    <strong className="table-name">
                      Table {order.tableNumber}
                    </strong>
                  </span>
                </div>
                <div className="table-owner">
                  <div className="order-process">
                    <span className="span-order">Waiter</span>
                    <p className="order-status-name">{order.waiterName}</p>
                  </div>
                  <div className="order-process2">
                    <span className="span-order">Status</span>
                    <p className="order-status-name">{order.status}</p>
                  </div>
                </div>
              </div>
            </div>
            <span className="time">
              {formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
              })}
            </span>
           { !waiter && (
            <div className="order-buttons">
              {order.status !== "Ready" ? (
                <button className="waiting" onClick={() => updateOrder(order)}>
                  Ready
                </button>
              ) : (
                <button
                  className = "gone"
                  onClick={() => deleteOrder(order)}
                >
                  Collected
                </button>
              )}
            </div>
           )

           } 
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
