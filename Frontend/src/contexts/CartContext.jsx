import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('medconnect-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('medconnect-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: quantity }]);
    }

    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, qty } : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;