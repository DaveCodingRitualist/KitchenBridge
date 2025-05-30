import { createContext, useReducer } from "react";
import React from "react";

export const OrdersContext = createContext()

export const ordersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ORDERS':
            return {
                orders: action.payload
            }
        case 'CREATE_ORDER':
            return {
                orders: [action.payload, ...state.orders]
            }
            case 'UPDATE_ORDER':
                return {
                  ...state,
                  orders: state.orders.map(order =>
                    order._id === action.payload._id ? action.payload : order
                  ), // Update the order by matching its _id
                };
                
            case 'DELETE_ORDER':
                return {
                    orders: state.orders.filter(order => order._id !== action.payload)
                }
            default: 
            return state
    }
}

export const OrdersContextProvider = ({ children }) => {
const [state, dispatch] = useReducer(ordersReducer, {
    orders: []
})

    return (
        <OrdersContext.Provider value={{...state, dispatch}}>
            { children }
        </OrdersContext.Provider>
    )
}