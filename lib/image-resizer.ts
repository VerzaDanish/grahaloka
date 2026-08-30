/**
 * Helper utility untuk auto-resize dan kompresi gambar di browser sebelum diunggah ke server.
 * Mengubah gambar besar (misal 5MB - 10MB) menjadi ukuran optimal max-width 1200px (format WebP/JPEG ~100KB-200KB).
 */

export interface ResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export function resizeImageFile(
  file: File,
  options: ResizeOptions = {}
): Promise<{ file: File; dataUrl: string; width: number; height: number }> {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality || 0.82;
  const format = options.format || 'image/webp';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung skala rasio agar tidak terdistorsi
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Gagal mendapatkan context 2D Canvas'));
          return;
        }

        // Render gambar ke canvas dengan smoothing halus
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas ke Data URL dan Blob
        const dataUrl = canvas.toDataURL(format, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Gagal membuat blob gambar'));
              return;
            }

            const ext = format === 'image/webp' ? 'webp' : 'jpg';
            const fileName = file.name.replace(/\.[^/.]+$/, '') + `_resized.${ext}`;
            const resizedFile = new File([blob], fileName, {
              type: format,
              lastModified: Date.now(),
            });

            resolve({
              file: resizedFile,
              dataUrl,
              width,
              height,
            });
          },
          format,
          quality
        );
      };

      img.onerror = () => reject(new Error('Gagal memuat file gambar'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}
