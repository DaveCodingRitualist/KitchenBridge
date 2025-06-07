import { AttentionContext } from "../context/AttentionContext";
import { useContext } from "react";
export const useAttentionContext= () => {
    const context = useContext(AttentionContext)
    if (!context) {
        throw Error('useWorkoutContext must be inside an AuthContextProvider')
    }
    return context
}