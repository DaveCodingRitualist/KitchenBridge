import React, { useEffect, useRef, useState } from "react";
import notificationSound from "/notification.mp3";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useOrdersContext } from "../hooks/useOrdersContext";
import { useAdminContext } from "../hooks/useAdminContext";
import { useAuthContext } from "../hooks/useAuthContext";
import io from "socket.io-client";
import ChatBox from "./ChatBox";

const OrderDetails = ({
  updateOrder,
  deleteOrder,
  orders,
  waiter,
  isLoading,
}) => {
  const { dispatch } = useOrdersContext();
  const { admin } = useAdminContext();
  const [openChatId, setOpenChatId] = useState(null);
  const [readId, setReadId] = useState(null);
  const [, forceUpdate] = useState(0);
  const { user } = useAuthContext();
  // const [attention, setAttention] = useState([]);

  const audioRef = useRef(null);
  const readyAudioRef = useRef(null);
  const prevOrdersRef = useRef([]);
  const readySoundPlayedRef = useRef(new Set());

  const attentionAudioRef = useRef(null);


  const handleAttention = async (id) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/orders/attention/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`, // if needed
          },
        }
      );
      const updatedOrder = await res.json();

      if (res.ok) {
        dispatch({ type: "UPDATE_ORDER", payload: updatedOrder });
      } else {
        console.error("Failed to update attention:", updatedOrder.message);
      }
    } catch (error) {
      console.error("Error updating attention:", error);
    }
  };

  const socket = io("http://localhost:5173");

  // Attention Socket 

 useEffect(() => {
  const socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL || "http://localhost:4000");

  socket.on("attentionToggled", (updatedOrder) => {
    dispatch({ type: "UPDATE_ORDER", payload: updatedOrder });

    // Only play sound if not admin AND the order was just added to attention
    if (!admin) {
      const wasJustAdded = updatedOrder.attention.includes(updatedOrder._id);
      if (wasJustAdded) {
        try {
          attentionAudioRef.current.currentTime = 0;
          attentionAudioRef.current.play().catch((err) => {
            console.warn("Attention sound failed to play", err);
          });
        } catch (err) {
          console.warn("Error playing attention sound:", err);
        }
      }
    }
  });

  return () => socket.disconnect();
}, [admin, dispatch]);




  useEffect(() => {
    const handleDisconnect = () => console.log("Disconnected");
    socket.on("disconnect", handleDisconnect);
    return () => socket.off("disconnect", handleDisconnect);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate((x) => x + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prevOrdersRef.current.length) {
      prevOrdersRef.current = orders;
      return;
    }

    orders.forEach((order) => {
      const prevOrder = prevOrdersRef.current.find((o) => o._id === order._id);
      if (!prevOrder || !prevOrder.chat) return;

      const prevLast = prevOrder.chat[prevOrder.chat.length - 1];
      const newLast = order.chat[order.chat.length - 1];

      const newMessage =
        prevLast !== newLast &&
        ((admin && newLast?.includes("How far")) ||
          (!admin && newLast?.includes("Minutes")));

      if (newMessage) {
        try {
          console.log("New message sound: attempting to play");
          audioRef.current.currentTime = 0;
          audioRef.current
            .play()
            .then(() => {
              console.log("New message sound played");
            })
            .catch((err) => {
              console.warn("New message sound failed to play", err);
            });
        } catch (err) {
          console.warn("New message sound error:", err);
        }
      }

      const becameReady =
        prevOrder.status !== "Ready" && order.status === "Ready";
      if (
        !admin &&
        becameReady &&
        !readySoundPlayedRef.current.has(order._id)
      ) {
        try {
          console.log("Order ready sound: attempting to play");
          readyAudioRef.current.currentTime = 0;
          readyAudioRef.current
            .play()
            .then(() => {
              console.log("Order ready sound played");
              readySoundPlayedRef.current.add(order._id);
            })
            .catch((err) => {
              console.warn("Order ready sound failed to play", err);
            });
        } catch (err) {
          console.warn("Order ready sound error:", err);
        }
      }
    });

    prevOrdersRef.current = orders;
  }, [orders, admin]);

  const openChat = (id) => {
    setOpenChatId(id);
    setReadId(id);
  };

  const closeChat = (id) => {
    setOpenChatId(null);
    setReadId(id);
  };

  const howFar = async (order) => {
    if (order.chat[order.chat.length - 1] === "How far is my order?") return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/chat/${
          order._id
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(order),
        }
      );
      const json = await res.json();

      if (res.ok) {
        dispatch({ type: "UPDATE_ORDER", payload: json });
        setTimeout(() => setOpenChatId(null), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
      <audio ref={readyAudioRef} src="/order-ready.mp3" preload="auto" />
      <audio ref={attentionAudioRef} src="/attention.mp3" preload="auto" />

      {/* Optional: enable audio by user gesture */}
      <button
        style={{ position: "absolute", opacity: 0 }}
        onClick={() => {
          audioRef.current?.play().catch(() => {});
          readyAudioRef.current?.play().catch(() => {});
        }}
      >
        Enable Audio
      </button>

      {isLoading ? (
        <p className="isloading">Fetching tables details may take a while...</p>
      ) : (
        orders &&
        orders.map((order, index) => (
          <div
            className={[
              order.status === "Ready" ? "ready" : "orders-list",
              order.attention.includes(order._id) ? "need-attention" : "",
            ].join(" ")}
            key={index}
          >
            <div className="orders-details">
              <div className="order-titles">
                <div className="table">
                  <span>
                    <strong className="table-name">
                      Table {order.tableNumber}
                    </strong>
                    {!admin &&
                      order.chat.length > 0 &&
                      readId &&
                      order.chat[order.chat.length - 1].includes("Minutes") && (
                        <span
                          className="new-message"
                          onClick={() => openChat(order._id)}
                        >
                          New message
                        </span>
                      )}
                    {admin &&
                      order.chat.length > 0 &&
                      order.chat[order.chat.length - 1].includes(
                        "How far is my order?"
                      ) && (
                        <span
                          className="new-message"
                          onClick={() => openChat(order._id)}
                        >
                          New message
                        </span>
                      )}
                    {admin &&
                      (!Array.isArray(order.chat) ||
                        order.chat.length === 0 ||
                        !order.chat[order.chat.length - 1]?.includes(
                          "How far is my order?"
                        )) && (
                        <span
                          className="attention"
                          onClick={() => handleAttention(order._id)}
                        >
                          Attention
                        </span>
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

              <span className="time">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </span>

              {admin && !waiter  && (
                <div className="order-buttons">
                  {order.status !== "Ready" ? (
                    <button
                      className="waiting"
                      onClick={() => updateOrder(order)}
                    >
                      Ready
                    </button>
                  ) : (
                    <button className="gone" onClick={() => deleteOrder(order)}>
                      Collected
                    </button>
                  )}
                </div>
              )}
              { !admin && order.attention.includes(order._id) && (
                <button disabled>{order.waiterName}! The chef needs you</button>)
              }
              {!admin && order.status !== "Ready" && !order.attention.includes(order._id) && (
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
        ))
      )}

      {!isLoading && orders.length === 0 && (
        <p className="no-order">There is no orders to display yet...</p>
      )}
    </div>
  );
};

export default OrderDetails;
