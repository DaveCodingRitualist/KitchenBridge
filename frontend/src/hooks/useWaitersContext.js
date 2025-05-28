import { WaitersContext } from "../context/WaitersContext";
import { useContext } from "react";

export const useWaitersContext = () => {
    const context = useContext(WaitersContext)

    if (!context) {
        throw Error('useOrdersContext must be used inside an Orders ContextProvider')
    }

    return context
}