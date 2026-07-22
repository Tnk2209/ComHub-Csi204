import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'comhub_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      const stockLimit = product.stock_quantity ?? product.stock ?? existing?.stock_quantity ?? 999;
      let next;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stockLimit);
        next = prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: newQty, stock_quantity: stockLimit, brand: product.brand || i.brand }
            : i
        );
      } else {
        const newQty = Math.min(quantity, stockLimit);
        next = [...prev, {
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url,
          brand: product.brand,
          stock_quantity: stockLimit,
          quantity: newQty,
        }];
      }
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product_id !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity, maxStock) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const targetItem = prev.find((i) => i.product_id === productId);
      const limit = maxStock ?? targetItem?.stock_quantity ?? targetItem?.stock ?? 999;
      const validQty = Math.min(quantity, limit);

      const next = prev.map((i) =>
        i.product_id === productId ? { ...i, quantity: validQty, stock_quantity: limit } : i
      );
      saveCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, totalPrice, totalItems, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
