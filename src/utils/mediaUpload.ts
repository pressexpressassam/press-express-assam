/**
 * Utility for handling gallery photo and video uploads from the user's device.
 * Automatically handles image resizing and compression so that media uploads
 * perform well and fit comfortably within client-side storage quotas.
 */

export interface ProcessedImage {
  dataUrl: string;
  name: string;
  sizeKb: number;
  width: number;
  height: number;
}

export interface ProcessedVideo {
  videoUrl: string;
  name: string;
  sizeMb: string;
  isBlobUrl: boolean;
}

/**
 * Resizes and compresses an image from device gallery to web-optimized data URL.
 */
export async function processImageFromGallery(file: File, maxDimension = 1280, quality = 0.82): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read photo from device gallery.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio bounded by maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context unavailable.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-optimized JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          name: file.name,
          sizeKb,
          width,
          height,
        });
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Processes a video uploaded from device gallery.
 * For videos up to 2.5MB, embeds as data URL.
 * For larger videos, creates an instant high-performance object URL for playback.
 */
export async function processVideoFromGallery(file: File): Promise<ProcessedVideo> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      return reject(new Error('Selected file is not a video.'));
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);

    // If video is small (< 2.5 MB), encode as base64 so it can persist in local state
    if (file.size <= 2.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read video from gallery.'));
      reader.onload = (e) => {
        resolve({
          videoUrl: e.target?.result as string,
          name: file.name,
          sizeMb: sizeInMb,
          isBlobUrl: false,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Create local object URL for instant high-def playback
      const objectUrl = URL.createObjectURL(file);
      resolve({
        videoUrl: objectUrl,
        name: file.name,
        sizeMb: sizeInMb,
        isBlobUrl: true,
      });
    }
  });
}
