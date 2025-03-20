import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'shopping_cart';

const initialState = {
  items: [],
  savedItems: [],
  checkoutStep: 0, // 0: cart, 1: shipping, 2: payment, 3: confirmation
};

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      break;

    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      break;

    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
      };
      break;

    case 'SAVE_FOR_LATER':
      const itemToSave = state.items.find(item => item.id === action.payload);
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        savedItems: [...state.savedItems, itemToSave],
      };
      break;

    case 'MOVE_TO_CART':
      const itemToMove = state.savedItems.find(item => item.id === action.payload);
      newState = {
        ...state,
        savedItems: state.savedItems.filter(item => item.id !== action.payload),
        items: [...state.items, itemToMove],
      };
      break;

    case 'REMOVE_SAVED_ITEM':
      newState = {
        ...state,
        savedItems: state.savedItems.filter(item => item.id !== action.payload),
      };
      break;

    case 'SET_CHECKOUT_STEP':
      newState = {
        ...state,
        checkoutStep: action.payload,
      };
      break;

    default:
      return state;
  }

  // Save state to localStorage after each change
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, loadState());

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const saveForLater = (itemId) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: itemId });
  };

  const moveToCart = (itemId) => {
    dispatch({ type: 'MOVE_TO_CART', payload: itemId });
  };

  const removeSavedItem = (itemId) => {
    dispatch({ type: 'REMOVE_SAVED_ITEM', payload: itemId });
  };

  const setCheckoutStep = (step) => {
    dispatch({ type: 'SET_CHECKOUT_STEP', payload: step });
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = subtotal > 0 ? 500 : 0; // Ksh 500 shipping fee
    return subtotal + shipping;
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      savedItems: state.savedItems,
      checkoutStep: state.checkoutStep,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      saveForLater,
      moveToCart,
      removeSavedItem,
      setCheckoutStep,
      getSubtotal,
      getTotal,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
