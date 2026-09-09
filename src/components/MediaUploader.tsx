import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2, 
  Check, 
  RefreshCw, 
  Film, 
  Sparkles,
  Link,
  Play
} from 'lucide-react';
import { processImageFromGallery, processVideoFromGallery } from '../utils/mediaUpload';

interface MediaUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  imageCaption?: string;
  onCaptionChange?: (caption: string) => void;
  videoUrl?: string;
  onVideoChange?: (url: string) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Tea Gardens (Upper Assam)',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Kaziranga Rhino Wildlife',
    url: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Brahmaputra Telemetry',
    url: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Assam Assembly / Dispur',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Sports Stadium Arena',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
  },
];

const PRESET_SAMPLE_VIDEOS = [
  {
    name: 'Brahmaputra Water Flow Drone Reel (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    name: 'Assam Wildlife Conservation Footage (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
];

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  imageUrl,
  onImageChange,
  imageCaption,
  onCaptionChange,
  videoUrl,
  onVideoChange,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageMeta, setImageMeta] = useState<{ name?: string; sizeKb?: number } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [videoMeta, setVideoMeta] = useState<{ name?: string; sizeMb?: string } | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [mediaMode, setMediaMode] = useState<'photo' | 'video' | 'url'>('photo');

  // Handle Photo selection from device gallery
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setIsProcessingImage(true);
    try {
      const result = await processImageFromGallery(file);
      onImageChange(result.dataUrl);
      setImageMeta({ name: result.name, sizeKb: result.sizeKb });
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Error uploading photo');
    } finally {
      setIsProcessingImage(false);
      // Reset input value so same file can be selected again if needed
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // Handle Video selection from device gallery
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    setIsProcessingVideo(true);
    try {
      const result = await processVideoFromGallery(file);
      if (onVideoChange) {
        onVideoChange(result.videoUrl);
      }
      setVideoMeta({ name: result.name, sizeMb: result.sizeMb });
    } catch (err: unknown) {
      setVideoError(err instanceof Error ? err.message : 'Error uploading video');
    } finally {
      setIsProcessingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
      {/* Media Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
          <ImageIcon className="w-4 h-4 text-red-600" />
          <span>Newsroom Media (Photo & Video Attachments)</span>
        </span>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMediaMode('photo')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              mediaMode === 'photo'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setMediaMode('video')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              mediaMode === 'video'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Video Report</span>
            {videoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
          </button>
          <button
            type="button"
            onClick={() => setMediaMode('url')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              mediaMode === 'url'
                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Direct URLs</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs for native gallery / file pickers */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload photo from device gallery"
        onChange={handleImageFileChange}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        aria-label="Upload video from device gallery"
        onChange={handleVideoFileChange}
        className="hidden"
      />

      {/* PHOTO TAB */}
      {mediaMode === 'photo' && (
        <div className="space-y-3">
          {imageError && (
            <p className="text-red-600 bg-red-50 dark:bg-red-950/40 p-2 rounded text-[11px]">
              {imageError}
            </p>
          )}

          {imageUrl ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 aspect-video max-h-56 group">
                <img
                  src={imageUrl}
                  alt="Story Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-md text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Photo from Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onImageChange('');
                      setImageMeta(null);
                    }}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Upload Meta Info & Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {imageMeta?.name ? `Uploaded: ${imageMeta.name}` : 'Photo Attached'}
                    {imageMeta?.sizeKb ? ` (${imageMeta.sizeKb} KB, optimized)` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Different Photo from Device Gallery</span>
                </button>
              </div>

              {/* Caption input */}
              {onCaptionChange && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Photo Caption / Photojournalist Credit
                  </label>
                  <input
                    type="text"
                    value={imageCaption || ''}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="e.g. Sentinel File Photo / Press Express Correspondent"
                    className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Upload Drop Area */
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/40 transition-colors group"
            >
              {isProcessingImage ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Compressing & Optimizing Photo...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to Upload Photo from Gallery / Device
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP from smartphone or desktop camera roll
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-md text-[11px] font-bold shadow-xs">
                    Select Photo from Gallery
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick preset chips */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium">Or choose Assam wire preset:</span>
            {PRESET_PHOTOS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  onImageChange(p.url);
                  setImageMeta({ name: p.name });
                }}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO TAB */}
      {mediaMode === 'video' && (
        <div className="space-y-3">
          {videoError && (
            <p className="text-red-600 bg-red-50 dark:bg-red-950/40 p-2 rounded text-[11px]">
              {videoError}
            </p>
          )}

          {videoUrl ? (
            <div className="space-y-2">
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video max-h-64">
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video.
                </video>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-red-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {videoMeta?.name ? `Video: ${videoMeta.name}` : 'Video Attached & Ready to Play'}
                    {videoMeta?.sizeMb ? ` (${videoMeta.sizeMb} MB)` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onVideoChange) onVideoChange('');
                      setVideoMeta(null);
                    }}
                    className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Video Area */
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-900/40 transition-colors group"
            >
              {isProcessingVideo ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-red-600" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Loading Video Footage...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full group-hover:scale-110 transition-transform">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to Upload Video Footage from Gallery
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Supports MP4, WebM, MOV, 3GP from phone camera or field recorder
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-md text-[11px] font-bold shadow-xs">
                    Select Video from Gallery
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Sample test videos */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-medium">Or attach sample report video:</span>
            {PRESET_SAMPLE_VIDEOS.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => {
                  if (onVideoChange) onVideoChange(v.url);
                  setVideoMeta({ name: v.name });
                }}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5 text-red-500" />
                <span>{v.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* URL TAB */}
      {mediaMode === 'url' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Cover Photo Web URL</span>
              <span className="text-[10px] text-slate-400 font-normal">Direct https:// link</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Video Stream / MP4 URL (Optional)</span>
              <span className="text-[10px] text-slate-400 font-normal">MP4, HLS, or WebM</span>
            </label>
            <input
              type="url"
              value={videoUrl || ''}
              onChange={(e) => onVideoChange && onVideoChange(e.target.value)}
              placeholder="https://example.com/stream.mp4"
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};
