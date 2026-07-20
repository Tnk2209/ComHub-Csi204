import { describe, it, expect, beforeEach, vi } from 'vitest';
import { compressImage } from './imageCompressor';

function createMockFile(size = 500000, type = 'image/png') {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], 'test-image.png', { type });
}

function setupCanvasMock({ naturalWidth = 2400, naturalHeight = 1600 } = {}) {
  const mockBlob = new Blob(['fake-webp-data'], { type: 'image/webp' });

  const mockCtx = { drawImage: vi.fn() };
  const mockCanvas = {
    getContext: vi.fn(() => mockCtx),
    toBlob: vi.fn((cb) => cb(mockBlob)),
    width: 0,
    height: 0,
  };
  vi.stubGlobal('document', {
    ...document,
    createElement: vi.fn((tag) => {
      if (tag === 'canvas') return mockCanvas;
      return document.createElement(tag);
    }),
  });

  // Mock Image with controllable dimensions
  class MockImage {
    constructor() {
      this.onload = null;
      setTimeout(() => {
        this.naturalWidth = naturalWidth;
        this.naturalHeight = naturalHeight;
        if (this.onload) this.onload();
      }, 0);
    }
    set src(_) {}
  }
  vi.stubGlobal('Image', MockImage);

  // Mock URL.createObjectURL / revokeObjectURL
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  });

  return { mockCanvas, mockCtx, mockBlob };
}

describe('imageCompressor', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('resizes image wider than 1200px and returns WebP base64', async () => {
    const { mockCanvas } = setupCanvasMock({ naturalWidth: 2400, naturalHeight: 1600 });
    const file = createMockFile();

    const result = await compressImage(file);

    expect(mockCanvas.width).toBe(1200);
    expect(mockCanvas.height).toBe(800);
    expect(result.base64).toMatch(/^data:image\/webp;base64,/);
    expect(result.originalSize).toBe(file.size);
    expect(result.compressedSize).toBeGreaterThan(0);
  });

  it('does not resize image narrower than 1200px', async () => {
    const { mockCanvas } = setupCanvasMock({ naturalWidth: 800, naturalHeight: 600 });
    const file = createMockFile();

    const result = await compressImage(file);

    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
    expect(result.base64).toMatch(/^data:image\/webp;base64,/);
  });

  it('rejects when canvas.toBlob returns null', async () => {
    setupCanvasMock({ naturalWidth: 800, naturalHeight: 600 });
    // Override toBlob to return null
    const canvas = document.createElement('canvas');
    canvas.toBlob = vi.fn((cb) => cb(null));

    const file = createMockFile();
    await expect(compressImage(file)).rejects.toThrow('Compression failed');
  });
});
