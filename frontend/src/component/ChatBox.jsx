import React, { useState, useEffect } from "react";
import { useOrdersContext } from "../hooks/useOrdersContext";
import { useAdminContext } from "../hooks/useAdminContext";
import { useSocket } from "../hooks/useSocket";
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);
const ChatBox = ({
  order,
  closeChat,
  howFar,
  openChatId,
  admin,
  setOpenChatId,
}) => {
  const [minutes, setMinutes] = useState("");
  const { dispatch } = useOrdersContext();
  

  // Socket event listeners
    useEffect(() => {
      if (!socket) return;
  
      // socket.on("orderCreated", (newOrder) => {
      //   dispatch({ type: "CREATE_ORDER", payload: newOrder });
      // });
  
      // socket.on("orderUpdated", (updatedOrder) => {
      //   dispatch({ type: "UPDATE_ORDER", payload: updatedOrder });
      // });
  
      // socket.on("orderDeleted", (deletedId) => {
      //   dispatch({ type: "DELETE_ORDER", payload: deletedId });
      // });
  
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

// KITCHEN ADMIN REPLY
  const handleForm = async (e) => {
    e.preventDefault();
    if(minutes.includes('Minutes')) {
      return
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/admin/chat/${order._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ minutes }),
        }
      );
      const json = await response.json();

      if (response.ok) {
        // console.log("Order updated:", json);
        dispatch({ type: "UPDATE_ORDER", payload: json });
        setMinutes("");
        setTimeout(() => {
          setOpenChatId(null);
        }, 2000);
      } else {
        console.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      {openChatId === order._id && (
        <div className="chat-box">
          {!admin && (
            <div className="waiter-chat-buttons">
              <button className="howfar-button" onClick={() => howFar(order)}>
                Ask how far...🤔
              </button>
              <button
                className={admin ? "close-chat" : "close-chat-waiter"}
                onClick={closeChat}
              >
                Close
              </button>
            </div>
          )}

          {order.chat.map((c, index) => (
            <p
              className={
                typeof c === "string" && c.includes("Minutes")
                  ? "chat-green chat-bubble glass"
                  : "chat-bubble glass"
              }
              key={index}
            >
              {typeof c === "number" ? `${c} Minutes` : c}
            </p>
          ))}

          {admin && order.chat.length > 0 && (
            <>
              <form className="chat-form" onSubmit={handleForm}>
                <input
                  type="number"
                  onChange={(e) => setMinutes(e.target.value)}
                  value={minutes}
                />
                <button>Reply</button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBox;
