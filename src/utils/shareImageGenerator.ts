import { Article } from '../types';

/**
 * Returns a clean, public share URL for the article.
 * Automatically converts private developer URLs ('ais-dev-') to public URLs ('ais-pre-')
 * so recipients on WhatsApp and web crawlers can open without hitting login cookie walls.
 */
export function getPublicShareUrl(article: Article): string {
  if (typeof window === 'undefined') {
    return `https://pressexpressassam.in/?article=${article.id}`;
  }

  let origin = window.location.origin;
  // Convert private AI Studio dev preview URL to public shared URL
  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  }

  return `${origin}/?article=${article.id}`;
}

/**
 * Formats a clean, readable news share message matching the user's specification:
 * - News Title (Assamese and English, clean and separated)
 * - Location
 * - A few lines of the news content/summary
 * - Simple clean link
 */
export function formatNewsShareText(article: Article, customUrl?: string): string {
  const url = customUrl || getPublicShareUrl(article);

  const assamese = article.titleAssamese ? `📰 *${article.titleAssamese.trim()}*` : '';
  const english = article.title
    ? (article.titleAssamese ? `(${article.title.trim()})` : `📰 *${article.title.trim()}*`)
    : '';

  const titlePart = [assamese, english].filter(Boolean).join('\n');
  const locationPart = `📍 ${article.district}, অসম`;
  const summaryPart = article.summary ? article.summary.trim() : '';
  const linkPart = `🔗 সবিশেষ পঢ়ক:\n${url}`;

  return `${titlePart}\n${locationPart}\n\n${summaryPart}\n\n${linkPart}`;
}

/**
 * Fetches the actual news photograph as a shareable File object.
 * Falls back to the branded news card generator if direct image fetch fails.
 */
export async function getArticlePhotoFile(article: Article): Promise<{ file: File; blob: Blob }> {
  try {
    const response = await fetch(article.imageUrl, { mode: 'cors' });
    if (response.ok) {
      const blob = await response.blob();
      const filename = `PressExpress-${article.slug || article.id}.jpg`;
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
      return { file, blob };
    }
  } catch {
    // If CORS or network prevents direct fetch, use canvas-generated news card
  }

  const generated = await generateNewsShareImage(article);
  return { file: generated.file, blob: generated.blob };
}

/**
 * Creates a high-definition branded news graphic canvas containing:
 * - The actual news photograph
 * - Red Breaking / Category badge
 * - Assamese and English headlines
 * - District & timestamp
 * - Official Press Express Assam branding watermark
 * 
 * Returns both a downloadable/shareable Blob and a DataURL.
 */
export async function generateNewsShareImage(article: Article): Promise<{ blob: Blob; dataUrl: string; file: File }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    // High-resolution 1200x630 (optimal for WhatsApp, Facebook, Twitter, and Instagram)
    const width = 1200;
    const height = 675; // 16:9 ratio
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not initialize canvas rendering context.'));
    }

    // Load article image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Fallback timer in case image CORS hangs
    const loadTimeout = setTimeout(() => {
      drawFallback(ctx, width, height, article);
      finishExport();
    }, 4000);

    img.onload = () => {
      clearTimeout(loadTimeout);
      try {
        drawFullCard(ctx, img, width, height, article);
        finishExport();
      } catch {
        drawFallback(ctx, width, height, article);
        finishExport();
      }
    };

    img.onerror = () => {
      clearTimeout(loadTimeout);
      drawFallback(ctx, width, height, article);
      finishExport();
    };

    img.src = article.imageUrl;

    function finishExport() {
      try {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              handleFallbackExport();
              return;
            }
            try {
              const file = new File([blob], `PressExpress-${article.slug || article.id}.jpg`, {
                type: 'image/jpeg',
              });
              let dataUrl = '';
              try {
                dataUrl = canvas.toDataURL('image/jpeg', 0.92);
              } catch {
                // If toDataURL is restricted
              }
              resolve({ blob, dataUrl, file });
            } catch {
              handleFallbackExport();
            }
          },
          'image/jpeg',
          0.92
        );
      } catch {
        handleFallbackExport();
      }
    }

    function handleFallbackExport() {
      try {
        ctx.clearRect(0, 0, width, height);
        drawFallback(ctx, width, height, article);
        canvas.toBlob(
          (fallbackBlob) => {
            if (!fallbackBlob) {
              return reject(new Error('Failed to generate share image'));
            }
            const file = new File([fallbackBlob], `PressExpress-${article.slug || article.id}.jpg`, {
              type: 'image/jpeg',
            });
            resolve({ blob: fallbackBlob, dataUrl: '', file });
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        reject(err);
      }
    }
  });
}

function drawFullCard(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  article: Article
) {
  // 1. Dark solid background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw news photo (cover style filling top portion or left side)
  // Let's do a modern split layout:
  // Top 58% is the full-width high-res news photo, bottom 42% is the news lower-third card
  const imgHeight = 420;
  
  // Draw image to cover (0, 0, w, imgHeight)
  const imgAspect = img.width / img.height;
  const targetAspect = w / imgHeight;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgAspect > targetAspect) {
    sWidth = img.height * targetAspect;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetAspect;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, imgHeight);

  // Gradient transition over image bottom
  const grad = ctx.createLinearGradient(0, imgHeight - 160, 0, imgHeight);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, imgHeight - 160, w, 160);

  // Lower banner background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, imgHeight - 1, w, h - imgHeight + 1);

  // Red accent dividing bar
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, imgHeight - 4, w, 5);

  // 3. Header Badges: Top-Left "PRESS EXPRESS ASSAM" & Top-Right District/Breaking
  // Top brand pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  roundRect(ctx, 36, 32, 290, 48, 24);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#dc2626';
  ctx.stroke();

  // Circle red dot
  ctx.beginPath();
  ctx.arc(60, 56, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('PRESS EXPRESS ASSAM', 80, 63);

  // Category & District Badges
  if (article.isBreaking) {
    ctx.fillStyle = '#dc2626';
    roundRect(ctx, w - 240, 32, 204, 46, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('⚡ ব্ৰেকিং নিউজ', w - 215, 62);
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    roundRect(ctx, w - 260, 32, 224, 46, 12);
    ctx.fill();
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`📍 ${article.district}`, w - 240, 62);
  }

  // 4. Headline rendering in bottom section
  let currentY = imgHeight + 42;

  // Assamese Headline (if present)
  if (article.titleAssamese) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Noto Sans", "Mukti", "Ador", sans-serif, -apple-system';
    const lines = wrapText(ctx, article.titleAssamese, w - 90);
    for (let i = 0; i < Math.min(lines.length, 2); i++) {
      ctx.fillText(lines[i], 45, currentY);
      currentY += 46;
    }
  }

  // English Headline or Summary
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const subText = article.titleAssamese ? article.title : article.summary;
  const subLines = wrapText(ctx, subText, w - 90);
  for (let i = 0; i < Math.min(subLines.length, article.titleAssamese ? 2 : 3); i++) {
    ctx.fillText(subLines[i], 45, currentY);
    currentY += 34;
  }

  // 5. Bottom footer metadata bar
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 18px sans-serif';
  const dateStr = new Date(article.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  ctx.fillText(`📅 ${dateStr}   •   ✍️ ${article.author}   •   🌐 pressexpressassam.in`, 45, h - 28);
}

function drawFallback(ctx: CanvasRenderingContext2D, w: number, h: number, article: Article) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Red accent top bar
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, w, 12);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  const title = article.titleAssamese || article.title;
  const lines = wrapText(ctx, title, w - 100);
  let y = 140;
  for (const line of lines.slice(0, 3)) {
    ctx.fillText(line, 50, y);
    y += 56;
  }

  // Summary
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '24px sans-serif';
  const sumLines = wrapText(ctx, article.summary, w - 100);
  y += 20;
  for (const line of sumLines.slice(0, 3)) {
    ctx.fillText(line, 50, y);
    y += 36;
  }

  // Watermark
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('PRESS EXPRESS ASSAM', 50, h - 50);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
