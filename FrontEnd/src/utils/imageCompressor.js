const MAX_WIDTH = 1200;
const WEBP_QUALITY = 0.8;

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX_WIDTH) {
        h = Math.round((h * MAX_WIDTH) / w);
        w = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              base64: reader.result,
              originalSize: file.size,
              compressedSize: blob.size,
            });
          };
          reader.onerror = () => reject(new Error('Failed to read blob'));
          reader.readAsDataURL(blob);
        },
        'image/webp',
        WEBP_QUALITY,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}
