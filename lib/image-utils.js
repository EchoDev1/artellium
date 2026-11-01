/**
 * ARTELLIUM AFRICA - HIGH-PERFORMANCE IMAGE ENGINE
 * Zero-Error Client-Side Auto-Compression, Validation & Resilient Fallback Engine
 */

export const CURATED_AFRICAN_ART_LIBRARY = [];

export const DEFAULT_FALLBACK_IMAGE = '';

/**
 * Returns a category-specific fallback image if an image URL is missing or broken.
 */
export function getCategoryFallback() {
  return '';
}

/**
 * Checks if a string is a valid URL or base64 image data URI.
 */
export function isValidImageSource(src) {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (trimmed.length < 10) return false;
  if (trimmed.startsWith('data:image/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) return true;
  return false;
}

/**
 * Compresses and optimizes an image client-side before upload or storage.
 * Downsamples huge phone/camera photos (e.g. 5000x4000px, 15MB) into crisp,
 * lightweight, high-definition images (max 1400px width/height, ~80KB-200KB).
 *
 * @param {File|Blob|string} imageSource - File object, Blob, or base64 data URL
 * @param {Object} options - { maxWidth: 1400, maxHeight: 1400, quality: 0.84, mimeType: 'image/jpeg' }
 * @returns {Promise<{ dataUrl: string, originalSize: number, compressedSize: number, width: number, height: number, savingsPct: number }>}
 */
export async function compressAndOptimizeImage(imageSource, options = {}) {
  const {
    maxWidth = 2800,
    maxHeight = 2800,
    quality = 0.95,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    let originalSize = 0;
    const processImageObj = (img, origSize, sourceMime) => {
      try {
        let width = img.width;
        let height = img.height;

        if (width === 0 || height === 0) {
          return reject(new Error('Image has zero dimensions.'));
        }

        // Calculate proportional Ultra-HD downsampled dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create High-DPI Offscreen Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: true });

        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Enable ultra-high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Preserve PNG transparency if source is PNG, else use high-fidelity JPEG/WebP
        const targetMime = (sourceMime === 'image/png' || sourceMime === 'image/webp') ? sourceMime : mimeType;
        const compressedDataUrl = canvas.toDataURL(targetMime, targetMime === 'image/png' ? undefined : quality);
        const compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // Approx base64 byte length
        const savingsPct = origSize > 0 ? Math.max(0, Math.round(((origSize - compressedSize) / origSize) * 100)) : 0;

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: origSize || compressedSize,
          compressedSize,
          width,
          height,
          savingsPct
        });
      } catch (err) {
        reject(err);
      }
    };

    if (typeof window === 'undefined') {
      return reject(new Error('Window not available for canvas processing.'));
    }

    if (imageSource instanceof File || imageSource instanceof Blob) {
      originalSize = imageSource.size;
      const fileMime = imageSource.type || 'image/jpeg';
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImageObj(img, originalSize, fileMime);
        img.onerror = () => reject(new Error('Failed to parse uploaded image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('FileReader error loading file.'));
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === 'string') {
      originalSize = Math.round((imageSource.length * 3) / 4);
      const isPngData = imageSource.startsWith('data:image/png');
      const isWebpData = imageSource.startsWith('data:image/webp');
      const detectedMime = isPngData ? 'image/png' : isWebpData ? 'image/webp' : 'image/jpeg';
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImageObj(img, originalSize, detectedMime);
      img.onerror = () => reject(new Error('Failed to load image from source URL/string.'));
      img.src = imageSource;
    } else {
      reject(new Error('Invalid image source type provided.'));
    }
  });
}

/**
 * Formats bytes into human-readable string (KB, MB).
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
