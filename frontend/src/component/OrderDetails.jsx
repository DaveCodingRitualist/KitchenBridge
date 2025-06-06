import React, { useEffect, useRef, useState } from "react";
import notificationSound from "/notification.mp3";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useOrdersContext } from "../hooks/useOrdersContext";
import { useAdminContext } from "../hooks/useAdminContext";
import { useAuthContext } from "../hooks/useAuthContext";
import io from "socket.io-client";
import ChatBox from "./ChatBox";

const OrderDetails = ({ updateOrder, deleteOrder, orders, waiter, isLoading }) => {
  const { dispatch } = useOrdersContext();
  const { admin } = useAdminContext();
  const [openChatId, setOpenChatId] = useState(null);
  const [readId, setReadId] = useState(null);
  const [, forceUpdate] = useState(0);
  const { user } = useAuthContext();

  const audioRef = useRef(null);
  const readyAudioRef = useRef(null);
  const prevOrdersRef = useRef([]);
  const readySoundPlayedRef = useRef(new Set());

  const socket = io("http://localhost:5173");

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
        ((admin && newLast?.includes("How far")) || (!admin && newLast?.includes("Minutes")));

      if (newMessage) {
        audioRef.current?.play().catch(() => {});
      }

      const becameReady = prevOrder.status !== "Ready" && order.status === "Ready";
      if (!admin && becameReady && !readySoundPlayedRef.current.has(order._id)) {
        readyAudioRef.current?.play().catch(() => {});
        readySoundPlayedRef.current.add(order._id);
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/orders/chat/${order._id}`,
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

      {isLoading ? (
        <p className="isloading">Fetching tables details may take a while...</p>
      ) : (
        orders.map((order, index) => (
          <div
            className={order.status === "Ready" ? "ready" : "orders-list"}
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
                        <span className="new-message" onClick={() => openChat(order._id)}>
                          New message
                        </span>
                      )}
                    {admin &&
                      order.chat.length > 0 &&
                      order.chat[order.chat.length - 1].includes("How far is my order?") && (
                        <span className="new-message" onClick={() => openChat(order._id)}>
                          New message
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

              {admin && !waiter && (
                <div className="order-buttons">
                  {order.status !== "Ready" ? (
                    <button className="waiting" onClick={() => updateOrder(order)}>
                      Ready
                    </button>
                  ) : (
                    <button className="gone" onClick={() => deleteOrder(order)}>
                      Collected
                    </button>
                  )}
                </div>
              )}

              {!admin && order.status !== "Ready" && (
                <button className="order-buttons" onClick={() => openChat(order._id)}>
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
    </div>
  );
};

export default OrderDetails;
