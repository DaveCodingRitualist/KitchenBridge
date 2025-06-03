import { createContext, useReducer } from "react";
import React from 'react';

export const WaitersContext = createContext()

export const waitersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WAITERS':
            return {
                waiters: action.payload
            }
        case 'CREATE_WAITER':
            return {
                waiters: [action.payload, ...state.waiters]
            }
        case 'DELETE_WAITER':
            return {
                waiters: state.waiters.filter(waiter => waiter._id !== action.payload)
            }
            default: 
            return state
    }
}

export const WaitersContextProvider = ({ children }) => {
const [state, dispatchWaiters] = useReducer(waitersReducer, {
    waiters: []
})

    return (
        <WaitersContext.Provider value={{...state, dispatchWaiters}}>
            { children }
        </WaitersContext.Provider>
    )
}