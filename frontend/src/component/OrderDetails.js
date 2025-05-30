import React, { useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useOrdersContext } from "../hooks/useOrdersContext";
import { useAdminContext } from "../hooks/useAdminContext";
import ChatBox from "./ChatBox";
const OrderDetails = ({ updateOrder, deleteOrder, orders, waiter, isLoading }) => {
  const { dispatch } = useOrdersContext();
  const { admin } = useAdminContext();
  const [openChatId, setOpenChatId] = useState(null); // tracks which order has chat open
  const [readId, setReadId] = useState(null); // tracks which order has chat open
  console.log(isLoading)
  const closeChat = () => {
    setOpenChatId(null);
    setReadId(false)
  };

  const openChat = (id) => {
    setOpenChatId(id); // Just set the ID of the chat you want to open
    setReadId(null);
  };

  // Function to update an order
  const howFar = async (order) => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/orders/chat/" + order._id,
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
        setTimeout(() => {
           setOpenChatId(null);
        }, 2000)
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  return (
    <div className="container">
    {isLoading && <p className="isloading">Feching tables details may take a while...</p>}
      {orders.map((order, index) => (
        <div
          className={`${order.status === "Ready" ? "ready" : "orders-list"}`}
          key={index}
        >
          <div className="orders-details">
            <div className="order-titles">
              <div className="table">
                <div className="table">
                  <span>
                    <strong className="table-name">
                      Table {order.tableNumber}
                    </strong>
                    {!admin &&
                      order.chat.length > 0 &&
                      order.chat[order.chat.length - 1].includes("Minutes") && (
                        <span className="new-message"
                        onClick={() => openChat(order._id)}
                        >New message</span>
                      )}
                    {admin &&
                      order.chat.length > 0 &&
                      order.chat[order.chat.length - 1].includes("How far is my order?") && (
                        <span className="new-message"
                        onClick={() => openChat(order._id)}
                        >New message</span>
                      )}
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
            {admin && (
              <>
                {!waiter && (
                  <div className="order-buttons">
                    {order.status !== "Ready" ? (
                      <button
                        className="waiting"
                        onClick={() => updateOrder(order)}
                      >
                        Ready
                      </button>
                    ) : (
                      <button
                        className="gone"
                        onClick={() => deleteOrder(order)}
                      >
                        Collected
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            {!admin && order.status !== "Ready" && (
              <button
                className="order-buttons"
                onClick={() => openChat(order._id)}
              >
                Open Chat
              </button>
            )}
            {!admin && order.status === "Ready" && (
              <button className="collect">
                {order.waiterName} go collect your Order
              </button>
            )}
          </div>
          {/* chat component */}
          <ChatBox
            order={order}
            howFar={howFar}
            openChat={openChatId === order._id}
            openChatId={openChatId}
            closeChat={closeChat}
            setReadId={setReadId}
            admin={admin}
            setOpenChatId={setOpenChatId}
          />
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
