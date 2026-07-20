import { renderHook, act } from '@testing-library/react';
import { CompareProvider, useCompare } from './CompareContext';

function wrapper({ children }) {
  return <CompareProvider>{children}</CompareProvider>;
}

const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};

Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true });

describe('CompareContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('starts with an empty compare list', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    expect(result.current.compareItems).toEqual([]);
  });

  it('adds a product to compare list', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
    });
    expect(result.current.compareItems).toHaveLength(1);
    expect(result.current.compareItems[0].id).toBe(1);
  });

  it('enforces max 3 products', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
      result.current.addToCompare({ id: 2, name: 'CPU B', category: 'CPU' });
      result.current.addToCompare({ id: 3, name: 'CPU C', category: 'CPU' });
    });
    const added = act(() => {
      return result.current.addToCompare({ id: 4, name: 'CPU D', category: 'CPU' });
    });
    expect(result.current.compareItems).toHaveLength(3);
  });

  it('enforces same category — rejects product from different category', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
    });
    act(() => {
      result.current.addToCompare({ id: 2, name: 'GPU A', category: 'GPU' });
    });
    expect(result.current.compareItems).toHaveLength(1);
    expect(result.current.compareItems[0].category).toBe('CPU');
  });

  it('removes a product from compare list', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
      result.current.addToCompare({ id: 2, name: 'CPU B', category: 'CPU' });
    });
    act(() => {
      result.current.removeFromCompare(1);
    });
    expect(result.current.compareItems).toHaveLength(1);
    expect(result.current.compareItems[0].id).toBe(2);
  });

  it('clears all products from compare list', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
      result.current.addToCompare({ id: 2, name: 'CPU B', category: 'CPU' });
    });
    act(() => {
      result.current.clearCompare();
    });
    expect(result.current.compareItems).toEqual([]);
  });

  it('prevents duplicate products', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
    });
    expect(result.current.compareItems).toHaveLength(1);
  });

  it('allows adding different category after clearing', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
    });
    act(() => {
      result.current.clearCompare();
    });
    act(() => {
      result.current.addToCompare({ id: 2, name: 'GPU A', category: 'GPU' });
    });
    expect(result.current.compareItems).toHaveLength(1);
    expect(result.current.compareItems[0].category).toBe('GPU');
  });

  it('persists compare list to localStorage', () => {
    const { result } = renderHook(() => useCompare(), { wrapper });
    act(() => {
      result.current.addToCompare({ id: 1, name: 'CPU A', category: 'CPU' });
    });
    const stored = JSON.parse(mockLocalStorage.getItem('comhub_compare'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it('restores compare list from localStorage on mount', () => {
    mockLocalStorage.setItem('comhub_compare', JSON.stringify([{ id: 5, name: 'GPU X', category: 'GPU' }]));
    const { result } = renderHook(() => useCompare(), { wrapper });
    expect(result.current.compareItems).toHaveLength(1);
    expect(result.current.compareItems[0].id).toBe(5);
  });
});
