// AttentionContext.js
import { createContext, useReducer } from 'react';

export const AttentionContext = createContext();

const attentionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ATTETION':
      return { ...state, attention: action.payload };
    default:
      return state;
  }
};

export const AttentionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attentionReducer, {
    attention: [], // ✅ Default to empty array
  });

  return (
    <AttentionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AttentionContext.Provider>
  );
};
