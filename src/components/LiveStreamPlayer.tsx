import React, { useState, useEffect } from 'react';
import { 
  X, 
  Radio, 
  Users, 
  Tv, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Heart, 
  ThumbsUp, 
  Flame, 
  ShieldAlert, 
  Signal, 
  Settings,
  Share2
} from 'lucide-react';
import { LiveStream, StreamReaction } from '../types';
import { INITIAL_LIVESTREAMS } from '../data/mockNews';

interface LiveStreamPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isOffline: boolean;
}

export const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({
  isOpen,
  onClose,
  isOffline,
}) => {
  const [selectedStream, setSelectedStream] = useState<LiveStream>(INITIAL_LIVESTREAMS[0]);
  const [streamQuality, setStreamQuality] = useState<'1080p' | '720p' | '480p' | 'audio-only'>('720p');
  const [isMuted, setIsMuted] = useState(false);
  const [reactions, setReactions] = useState<StreamReaction[]>([
    { id: '1', user: 'Nabajit Das (Guwahati)', text: 'Good discussion on Brahmaputra river silt monitoring!', emoji: '👏', timestamp: '1m ago' },
    { id: '2', user: 'Mousumi Bora (Jorhat)', text: 'Tata Jagiroad semiconductor project will create great jobs for Assam youth', emoji: '🔥', timestamp: '45s ago' },
    { id: '3', user: 'Kalyan Saikia (Silchar)', text: 'Audio clarity is excellent even here on mobile network', emoji: '❤️', timestamp: '20s ago' },
    { id: '4', user: 'Dimpu Roy (Dibrugarh)', text: 'Jai Aai Axom! Proud to see 24/7 digital broadcasting', emoji: '🙏', timestamp: 'Just now' },
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [isSimulatedPip, setIsSimulatedPip] = useState(false);

  // Periodic random comment injection to simulate real live broadcast activity
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const mockComments = [
        { user: 'Bikash Kalita (Nagaon)', text: 'River levels in Kaliabor look stable today.', emoji: '👍' },
        { user: 'Rupjyoti Sarma (Tezpur)', text: 'Kudos to Press Express team for live reporting from Dispur.', emoji: '👏' },
        { user: 'Himadri Gogoi (Sivasagar)', text: 'Connecting from Sivasagar, crisp video feed!', emoji: '❤️' },
        { user: 'Arunav Hazarika (Tinsukia)', text: 'Audio only mode works smoothly in our tea garden area!', emoji: '⚡' },
      ];
      const random = mockComments[Math.floor(Math.random() * mockComments.length)];
      setReactions(prev => [
        ...prev.slice(-15),
        {
          id: 'rx-' + Date.now(),
          user: random.user,
          text: random.text,
          emoji: random.emoji,
          timestamp: 'Just now'
        }
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newRx: StreamReaction = {
      id: 'rx-' + Date.now(),
      user: 'You (Angaraj)',
      text: commentInput.trim(),
      emoji: '💬',
      timestamp: 'Just now'
    };
    setReactions(prev => [...prev, newRx]);
    setCommentInput('');
  };

  const handleQuickReaction = (emoji: string) => {
    const newRx: StreamReaction = {
      id: 'rx-' + Date.now(),
      user: 'You',
      text: emoji,
      emoji: emoji,
      timestamp: 'Just now'
    };
    setReactions(prev => [...prev, newRx]);
  };

  return (
    <div className={`fixed z-50 transition-all ${
      isSimulatedPip 
        ? 'bottom-4 right-4 w-96 max-w-[95vw] shadow-2xl rounded-xl border border-red-600 overflow-hidden'
        : 'inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4'
    }`}>
      <div className={`bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 flex flex-col overflow-hidden w-full ${
        isSimulatedPip ? 'h-[280px]' : 'max-w-6xl max-h-[92vh] h-full shadow-2xl'
      }`}>
        {/* Stream Header */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-none font-newspaper text-white">
                  {selectedStream.channelName}
                </h3>
                <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded">
                  LIVE
                </span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded border border-slate-700 hidden sm:inline">
                  {selectedStream.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live viewer count */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-300 border border-slate-700/50">
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span>{selectedStream.viewerCount.toLocaleString()} watching</span>
            </div>

            {/* PiP button */}
            <button
              onClick={() => setIsSimulatedPip(!isSimulatedPip)}
              title={isSimulatedPip ? "Expand stream" : "Picture in Picture mode"}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close Stream"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900 hover:text-white text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Video Player + Channel Switcher & Live Chat */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Video Canvas & Controls */}
          <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
            {/* Stream Canvas */}
            <div className="relative w-full flex-1 min-h-[220px] bg-slate-950 flex items-center justify-center overflow-hidden">
              {isOffline ? (
                <div className="p-6 text-center max-w-md space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                    <Signal className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-amber-300">Offline Broadcast Mode</h4>
                  <p className="text-xs text-slate-400">
                    Live video streaming requires an active internet connection. Please switch to Online mode or read your cached articles in remote areas.
                  </p>
                </div>
              ) : streamQuality === 'audio-only' ? (
                /* Remote Area Low-Bandwidth Audio Mode */
                <div className="text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                    <Radio className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-300 font-newspaper">
                      Low-Bandwidth Audio Broadcast
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Optimized for 2G/3G connectivity in remote tea gardens, hills & riverine Char settlements. Consumes ~16 kbps bandwidth.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 h-6">
                    {[16, 28, 45, 32, 60, 48, 20, 54, 38, 25, 42, 18].map((h, i) => (
                      <span 
                        key={i} 
                        style={{ height: `${h}%` }} 
                        className="w-1.5 bg-emerald-400 rounded-full animate-bounce"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Video Simulation with animated broadcast overlay */
                <div className="relative w-full h-full">
                  <img
                    src={selectedStream.thumbnailUrl}
                    alt={selectedStream.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Live broadcast graphic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
                  
                  {/* On-air lower third banner */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                          NOW BROADCASTING
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white mt-0.5 line-clamp-1">
                        {selectedStream.currentSegment}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400">Resolution:</span>
                      <span className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded font-mono font-bold border border-slate-700">
                        {streamQuality}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Control Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Channel Selector Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {INITIAL_LIVESTREAMS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStream(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                      selectedStream.id === s.id
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Tv className="w-3 h-3" />
                    <span>{s.channelName}</span>
                  </button>
                ))}
              </div>

              {/* Quality & Audio Switcher */}
              <div className="flex items-center gap-2">
                {/* Audio Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Quality options */}
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 text-[10px] font-bold border border-slate-700/60">
                  {(['1080p', '720p', '480p', 'audio-only'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setStreamQuality(q)}
                      className={`px-1.5 py-0.5 rounded ${
                        streamQuality === q ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {q === 'audio-only' ? '🎧 Audio Only' : q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Reaction Feed (if not PiP) */}
          {!isSimulatedPip && (
            <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 h-64 lg:h-auto">
              {/* Chat Title */}
              <div className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                  Live Viewer Discussion
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Assam Live Wire</span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
                {reactions.map((rx) => (
                  <div key={rx.id} className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-200">{rx.user}</span>
                      <span>{rx.timestamp}</span>
                    </div>
                    <p className="text-slate-300 flex items-center justify-between gap-2">
                      <span>{rx.text}</span>
                      {rx.emoji && <span className="text-sm">{rx.emoji}</span>}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Emojis & Chat input */}
              <div className="p-2.5 border-t border-slate-800 bg-slate-950 space-y-2">
                <div className="flex items-center justify-between px-1">
                  {['❤️', '👏', '🙏', '🔥', '👍'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleQuickReaction(emoji)}
                      className="text-base hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendComment} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Send a live comment..."
                    className="flex-1 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs border border-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
