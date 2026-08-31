/**
 * ARTELLIUM AFRICA - HIGH-PERFORMANCE IMAGE ENGINE
 * Zero-Error Client-Side Auto-Compression, Validation & Resilient Fallback Engine
 */

export const CURATED_AFRICAN_ART_LIBRARY = [
  {
    id: 'lib-1',
    category: 'Paintings',
    title: 'The Ancestral Horizon',
    artist: 'Kofi Mensah (Ghana)',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    tag: 'Gold Leaf & Indigo Acrylic'
  },
  {
    id: 'lib-2',
    category: 'Sculptures',
    title: 'Bronze Royal Head of Benin',
    artist: 'Amina Diallo (Nigeria)',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    tag: 'Lost-Wax Cast Bronze'
  },
  {
    id: 'lib-3',
    category: 'Paintings',
    title: 'Ochre Symphony of the Serengeti',
    artist: 'Tariq Ndebele (South Africa)',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200',
    tag: 'Natural Earth Pigments'
  },
  {
    id: 'lib-4',
    category: 'Sculptures',
    title: 'Sacred Iroko Ceremonial Mask',
    artist: 'Chief Bakare Ogundele (Nigeria)',
    url: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1200',
    tag: 'Carved Timber & Brass'
  },
  {
    id: 'lib-5',
    category: 'Textiles',
    title: 'Royal Kente Golden Tapestry',
    artist: 'Adwoa Boateng (Ghana)',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=1200',
    tag: 'Handwoven Silk & Gold Thread'
  },
  {
    id: 'lib-6',
    category: 'Photography',
    title: 'Daughters of the Sahara',
    artist: 'Fatima Al-Mansoor (Morocco)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    tag: 'Fine Art Silver Halide Print'
  },
  {
    id: 'lib-7',
    category: 'Pottery',
    title: 'Ancient Nok Terracotta Vessel',
    artist: 'Danladi Ibrahim (Nigeria)',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1200',
    tag: 'Kiln-Fired Terracotta'
  },
  {
    id: 'lib-8',
    category: 'Woodworks',
    title: 'Ancestral Throne of Ashanti',
    artist: 'Kwame Asante (Ghana)',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    tag: 'Carved Mahogany & Silver Sheathing'
  },
  {
    id: 'lib-9',
    category: 'Indigenous artworks',
    title: 'Zulu Beaded Sovereign Headdress',
    artist: 'Nomsa Khumalo (South Africa)',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1200',
    tag: 'Sacred Glass Beadwork'
  },
  {
    id: 'lib-10',
    category: 'Drawings',
    title: 'Nile Papyrus Hieroglyphic Study',
    artist: 'Youssef El-Masri (Egypt)',
    url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&q=80&w=1200',
    tag: 'Charcoal & Ink on Papyrus'
  }
];

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200';

/**
 * Returns a category-specific fallback image if an image URL is missing or broken.
 */
export function getCategoryFallback(category = '') {
  const match = CURATED_AFRICAN_ART_LIBRARY.find(
    (item) => item.category?.toLowerCase() === category?.toLowerCase()
  );
  return match?.url || DEFAULT_FALLBACK_IMAGE;
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
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.84,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    let originalSize = 0;
    const processImageObj = (img, origSize) => {
      try {
        let width = img.width;
        let height = img.height;

        if (width === 0 || height === 0) {
          return reject(new Error('Image has zero dimensions.'));
        }

        // Calculate proportional downsampled dimensions
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

        // Create Offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG/WebP data URL
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => processImageObj(img, originalSize);
        img.onerror = () => reject(new Error('Failed to parse uploaded image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('FileReader error loading file.'));
      reader.readAsDataURL(imageSource);
    } else if (typeof imageSource === 'string') {
      originalSize = Math.round((imageSource.length * 3) / 4);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImageObj(img, originalSize);
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
