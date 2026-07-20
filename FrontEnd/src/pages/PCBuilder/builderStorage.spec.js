import { describe, it, expect, beforeEach, vi } from 'vitest';

const store = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value); }),
  removeItem: vi.fn((key) => { delete store[key]; }),
};

vi.stubGlobal('localStorage', mockLocalStorage);

describe('builderStorage', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    vi.clearAllMocks();
  });

  describe('loadBuilderState', () => {
    it('returns default empty parts when nothing is stored', async () => {
      const { loadBuilderState } = await import('./builderStorage');
      const result = loadBuilderState();
      expect(result).toEqual({
        cpu: null,
        gpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        case: null,
        psu: null,
      });
    });

    it('returns parsed parts when localStorage has valid data', async () => {
      const saved = {
        cpu: { id: 1, name: 'Ryzen 5 7600X', price: 200, tdp: 65, socket: 'AM5' },
        gpu: null, motherboard: null, ram: null, storage: null, case: null, psu: null,
      };
      store['comhub_builder'] = JSON.stringify(saved);
      const { loadBuilderState } = await import('./builderStorage');
      const result = loadBuilderState();
      expect(result).toEqual(saved);
    });

    it('returns defaults when localStorage contains invalid JSON', async () => {
      store['comhub_builder'] = '{broken json!!';
      const { loadBuilderState } = await import('./builderStorage');
      const result = loadBuilderState();
      expect(result).toEqual({
        cpu: null, gpu: null, motherboard: null,
        ram: null, storage: null, case: null, psu: null,
      });
    });

    it('fills missing categories with null when stored data is partial', async () => {
      store['comhub_builder'] = JSON.stringify({ cpu: { id: 1, name: 'X', price: 100 } });
      const { loadBuilderState } = await import('./builderStorage');
      const result = loadBuilderState();
      expect(result.cpu).toEqual({ id: 1, name: 'X', price: 100 });
      expect(result.gpu).toBeNull();
      expect(result.motherboard).toBeNull();
      expect(result.psu).toBeNull();
    });
  });

  describe('saveBuilderState', () => {
    it('writes parts as JSON to comhub_builder key', async () => {
      const { saveBuilderState } = await import('./builderStorage');
      const parts = {
        cpu: { id: 1, name: 'i7-13700K', price: 350, tdp: 125, socket: 'LGA1700' },
        gpu: null, motherboard: null, ram: null, storage: null, case: null, psu: null,
      };
      saveBuilderState(parts);
      const stored = JSON.parse(store['comhub_builder']);
      expect(stored).toEqual(parts);
    });
  });

  describe('clearBuilderState', () => {
    it('removes comhub_builder from localStorage', async () => {
      store['comhub_builder'] = JSON.stringify({ cpu: { id: 1 } });
      const { clearBuilderState } = await import('./builderStorage');
      clearBuilderState();
      expect(store['comhub_builder']).toBeUndefined();
    });
  });
});
