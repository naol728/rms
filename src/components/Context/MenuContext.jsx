import React, { createContext, useContext, useReducer, useEffect } from "react";
import menuService from "../../services/menuService";

// 1️⃣ Create Menu Context
const MenuContext = createContext();

// 2️⃣ Reducer function
const menuReducer = (state, action) => {
  switch (action.type) {
    case "SET_MENU_ITEMS":
      return { ...state, menuItems: action.payload, loading: false };

    case "ADD_MENU_ITEM":
      return { ...state, menuItems: [...state.menuItems, action.payload] };

    case "UPDATE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };

    case "DELETE_MENU_ITEM":
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

// 3️⃣ Initial state
const initialState = {
  menuItems: [],
  loading: true,
  error: null,
};

// 4️⃣ Provider component
export const MenuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(menuReducer, initialState);

  // Load menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const result = await menuService.getMenuItems();
        if (result.success) {
          dispatch({ type: "SET_MENU_ITEMS", payload: result.data });
        } else {
          // Show database error
          dispatch({
            type: "SET_ERROR",
            payload:
              result.error ||
              "Database connection failed. Please check your connection and try again.",
          });
        }
      } catch (error) {
        // Use mock data if API fails
        const mockMenuItems = [
          {
            id: 1,
            name: "Cheese Salad",
            description: "Delicious cheese salad with fresh vegetables",
            price: 12.99,
            category: "Appetizer",
            image_url: "/images/Chees Salad.jpg",
            is_available: true,
          },
          {
            id: 2,
            name: "Burger",
            description: "Juicy beef burger with fries",
            price: 10.5,
            category: "Main Course",
            image_url: "/images/Burger.jpg",
            is_available: true,
          },
          {
            id: 3,
            name: "Caesar Salad",
            description: "Fresh Caesar salad with croutons",
            price: 8.0,
            category: "Appetizer",
            image_url: "/images/Caesar Salad.jpg",
            is_available: true,
          },
          {
            id: 4,
            name: "Chocolate Cake",
            description: "Rich chocolate cake with cream",
            price: 6.5,
            category: "Dessert",
            image_url: "/images/Chocolate Cake.jpj.jpg",
            is_available: true,
          },
          {
            id: 5,
            name: "Coffee",
            description: "Hot brewed coffee",
            price: 3.0,
            category: "Beverage",
            image_url: "/images/Coffee.jpg",
            is_available: true,
          },
          {
            id: 6,
            name: "Ice Cream",
            description: "Vanilla ice cream",
            price: 4.5,
            category: "Dessert",
            image_url: "/images/chocolat.jpg",
            is_available: true,
          },
          {
            id: 7,
            name: "French Fries",
            description: "Crispy golden fries",
            price: 5.0,
            category: "Appetizer",
            image_url: "/images/French Fries.jpg",
            is_available: true,
          },
          {
            id: 8,
            name: "Grilled Chicken",
            description: "Grilled chicken breast with herbs",
            price: 14.0,
            category: "Main Course",
            image_url: "/images/Grilled Chicken.jpg",
            is_available: true,
          },
          {
            id: 9,
            name: "Lemonade",
            description: "Fresh lemonade",
            price: 3.5,
            category: "Beverage",
            image_url: "/images/Lemonade.jpg",
            is_available: true,
          },
          {
            id: 10,
            name: "Pasta Carbonara",
            description: "Creamy pasta with bacon",
            price: 13.0,
            category: "Main Course",
            image_url: "/images/Pasta Carbonara.jpg",
            is_available: true,
          },
          {
            id: 11,
            name: "Garlic Bread",
            description: "Toasted garlic bread",
            price: 4.0,
            category: "Appetizer",
            image_url: "/images/Garlic Bread.jpg",
            is_available: true,
          },
          {
            id: 12,
            name: "Mango Smoothie",
            description: "Refreshing mango smoothie",
            price: 5.0,
            category: "Beverage",
            image_url: "/images/Mango Smoothie.jpg",
            is_available: true,
          },
        ];
        dispatch({ type: "SET_MENU_ITEMS", payload: mockMenuItems });
      }
    };

    loadMenuItems();
  }, []);

  // Menu actions
  const addMenuItem = async (menuItemData) => {
    try {
      const result = await menuService.createMenuItem(menuItemData);
      if (result.success) {
        dispatch({ type: "ADD_MENU_ITEM", payload: result.data });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateMenuItem = async (id, menuItemData) => {
    try {
      const result = await menuService.updateMenuItem(id, menuItemData);
      if (result.success) {
        dispatch({ type: "UPDATE_MENU_ITEM", payload: result.data });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      const result = await menuService.deleteMenuItem(id);
      if (result.success) {
        dispatch({ type: "DELETE_MENU_ITEM", payload: id });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const toggleAvailability = async (id, available) => {
    try {
      const result = await menuService.toggleAvailability(id, available);
      if (result.success) {
        dispatch({ type: "UPDATE_MENU_ITEM", payload: result.data });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshMenuItems = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const result = await menuService.getMenuItems();
      if (result.success) {
        dispatch({ type: "SET_MENU_ITEMS", payload: result.data });
      } else {
        dispatch({ type: "SET_ERROR", payload: result.error });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  return (
    <MenuContext.Provider
      value={{
        state,
        dispatch,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        refreshMenuItems,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// 5️⃣ Custom hook for easier usage
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
};
