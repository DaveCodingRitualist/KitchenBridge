import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useOrdersContext } from "./useOrdersContext";

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export const useSocket = () => {
  const { dispatch } = useOrdersContext();
  const hasSubscribed = useRef(false); // prevent multiple subscriptions

  useEffect(() => {
    if (hasSubscribed.current) return;

    hasSubscribed.current = true;

    socket.on("orderCreated", (order) => {
      dispatch({ type: "CREATE_ORDER", payload: order });
    });

    socket.on("orderUpdated", (order) => {
      dispatch({ type: "UPDATE_ORDER", payload: order });
    });

    socket.on("orderDeleted", (orderId) => {
      dispatch({ type: "DELETE_ORDER", payload: orderId });
    });

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdated");
      socket.off("orderDeleted");
    };
  }, [dispatch]);
};
