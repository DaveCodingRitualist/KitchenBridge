import { useEffect } from "react";
import { io } from 'socket.io-client'
import { useOrdersContext } from "./useOrdersContext";

const socket = io(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL);

export const useSocket = () => {
    const { dispatch } = useOrdersContext()

  useEffect(() => {
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