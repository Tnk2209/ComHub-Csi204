import { createContext, useContext, useState, useCallback } from 'react';

const CompareContext = createContext(null);

const STORAGE_KEY = 'comhub_compare';
const MAX_ITEMS = 3;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(loadFromStorage);

  const persist = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToCompare = useCallback((product) => {
    setCompareItems((prev) => {
      if (prev.length >= MAX_ITEMS) return prev;
      if (prev.some((p) => p.id === product.id)) return prev;
      if (prev.length > 0 && prev[0].category !== product.category) return prev;
      const next = [...prev, product];
      persist(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((productId) => {
    setCompareItems((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      persist(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be inside CompareProvider');
  return ctx;
}
