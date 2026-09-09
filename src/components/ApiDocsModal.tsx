import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Server, 
  Zap, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { ApiEndpointDoc } from '../types';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedResponse, setExecutedResponse] = useState<string | null>(null);
  const [measuredLatency, setMeasuredLatency] = useState<number | null>(null);

  if (!isOpen) return null;

  const endpoints: ApiEndpointDoc[] = [
    {
      method: 'GET',
      path: '/api/v1/articles',
      summary: 'List Latest Assam News & Categorized Feeds',
      description: 'Fetches paginated, categorized articles with support for district filters, sorting by popularity score, and ETag conditional HTTP caching.',
      latencyMs: 14,
      cached: true,
      queryParams: [
        { name: 'category', type: 'string', description: 'Filter by vertical (e.g. wildlife-floods, tea-economy, guwahati, sports)' },
        { name: 'district', type: 'string', description: 'Filter by Assam district (e.g. Kamrup Metropolitan, Dibrugarh, Jorhat)' },
        { name: 'limit', type: 'number', description: 'Results per page (default: 10, max: 50)' },
      ],
      sampleResponse: {
        status: 'success',
        cached: true,
        edgePop: 'GAU-01 (Guwahati North Edge)',
        latency_ms: 12,
        data: {
          total: 48,
          count: 2,
          articles: [
            {
              id: 'art-001',
              title: 'Brahmaputra Flood Management: High-Tech Telemetry & Silt Sensors Deployed',
              category: 'wildlife-floods',
              district: 'Kamrup Metropolitan',
              publishedAt: '2026-09-02T21:30:00Z',
              readTimeMinutes: 4,
              popularityScore: 98
            },
            {
              id: 'art-002',
              title: 'Tata Semiconductor Facility at Jagiroad Achieves Cleanroom Milestone',
              category: 'tea-economy',
              district: 'Kamrup Metropolitan',
              publishedAt: '2026-09-02T19:15:00Z',
              readTimeMinutes: 3,
              popularityScore: 94
            }
          ]
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/breaking',
      summary: 'Real-time Breaking News Alert Broadcast',
      description: 'Ultra-low-latency endpoint tuned for high concurrency during flood alerts and urgent state announcements. Served directly from edge RAM caches.',
      latencyMs: 6,
      cached: true,
      sampleResponse: {
        status: 'success',
        isBreakingActive: true,
        urgentAlert: {
          id: 'art-001',
          headline: 'Brahmaputra Flood Management: High-Tech Telemetry & Silt Sensors Deployed Across 14 River Basins',
          district: 'Kamrup Metropolitan',
          priority: 'CRITICAL_EARLY_WARNING',
          issuedAt: '2026-09-02T21:30:00Z',
          broadcastChannels: ['WEB_PUSH', 'SMS_GATEWAY', 'OFFLINE_RADIO_METRIC']
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/livestreams',
      summary: 'Active Video & Audio Stream Feeds',
      description: 'Returns metadata, HLS manifest URLs, current viewer counts, and audio-only streaming endpoints for remote 2G/3G connectivity.',
      latencyMs: 18,
      cached: false,
      sampleResponse: {
        status: 'success',
        activeStreams: [
          {
            id: 'stream-01',
            channelName: 'Express 24x7 HD',
            status: 'live',
            viewerCount: 14820,
            currentSegment: 'Live Panel: Brahmaputra Flood Management & Industry Roadmap',
            hlsUrl: 'https://cdn.pressexpressassam.in/live/express24x7.m3u8',
            audioOnlyUrl: 'https://cdn.pressexpressassam.in/live/express-lowband.aac'
          }
        ]
      }
    },
    {
      method: 'POST',
      path: '/api/v1/sync',
      summary: 'Cross-Device Cloud State Synchronization',
      description: 'Synchronizes reading positions, offline bookmarks, and notification subscription topics with end-to-end AES encryption tokens.',
      latencyMs: 22,
      cached: false,
      requestBody: JSON.stringify({
        deviceId: 'dev_pixel_9_gau',
        lastSyncTimestamp: '2026-09-02T22:00:00Z',
        bookmarks: ['art-001', 'art-002'],
        preferredDistricts: ['Kamrup Metropolitan', 'Dibrugarh']
      }, null, 2),
      sampleResponse: {
        status: 'synchronized',
        syncTimestamp: '2026-09-02T23:22:15Z',
        connectedDevicesCount: 3,
        encryptionVerified: true
      }
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/popular',
      summary: 'Content Popularity & Readership Intelligence',
      description: 'Provides aggregated trending heat scores, top reader counts per district, and platform edge reliability metrics.',
      latencyMs: 15,
      cached: true,
      sampleResponse: {
        status: 'success',
        platformMetrics: {
          activeReadersNow: 18490,
          averageLatencyMs: 12.4,
          cacheHitRatePct: 96.4,
          topCategory: 'wildlife-floods'
        }
      }
    }
  ];

  const current = endpoints[selectedEndpointIndex];

  const getCurlSnippet = (ep: ApiEndpointDoc) => {
    return `curl -X ${ep.method} "https://api.pressexpressassam.in${ep.path}" \\
  -H "Accept: application/json" \\
  -H "X-Client-Platform: PressExpress-Assam-Web"`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet(current));
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleExecuteRequest = () => {
    setIsExecuting(true);
    setExecutedResponse(null);
    const start = performance.now();
    setTimeout(() => {
      const elapsed = Math.round(performance.now() - start + current.latencyMs);
      setMeasuredLatency(elapsed);
      setExecutedResponse(JSON.stringify(current.sampleResponse, null, 2));
      setIsExecuting(false);
    }, 320);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Press Express Assam REST API Architecture</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Low-latency, high-scalability API documentation & interactive developer sandbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Architecture Specs Highlight Ribbon */}
        <div className="bg-slate-900 text-slate-300 px-5 py-2.5 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Latency: <strong>&lt; 15 ms</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>CDN POP: <strong>Guwahati (GAU-01)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Transport: <strong>HTTP/3 QUIC + Brotli</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Security: <strong>OAuth 2.0 + TLS 1.3</strong></span>
          </div>
        </div>

        {/* Main Body: Endpoint List + Detail Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-xs">
          {/* Left Column: Endpoint selector */}
          <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-1.5 shrink-0">
            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block px-2 mb-1">
              API Endpoints (v1)
            </span>
            {endpoints.map((ep, idx) => {
              const isSelected = idx === selectedEndpointIndex;
              return (
                <button
                  key={ep.path}
                  onClick={() => {
                    setSelectedEndpointIndex(idx);
                    setExecutedResponse(null);
                    setMeasuredLatency(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-xs'
                      : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[9px] ${
                      ep.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{ep.latencyMs}ms
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                    {ep.path}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {ep.summary}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Endpoint Documentation & Sandbox */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                  current.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {current.method}
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                  {current.path}
                </span>
                {current.cached && (
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                    Edge Cached
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                {current.description}
              </p>
            </div>

            {/* Query parameters table if any */}
            {current.queryParams && (
              <div>
                <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-1.5">
                  Query Parameters
                </h5>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
                      {current.queryParams.map((qp) => (
                        <tr key={qp.name}>
                          <td className="p-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{qp.name}</td>
                          <td className="p-2 font-mono text-slate-400">{qp.type}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-400">{qp.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body if POST */}
            {current.requestBody && (
              <div>
                <h5 className="font-bold uppercase tracking-wider text-[11px] text-slate-500 mb-1.5">
                  Request Payload (JSON)
                </h5>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {current.requestBody}
                </pre>
              </div>
            )}

            {/* cURL Request Snippet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500">
                  cURL Request Example
                </span>
                <button
                  onClick={handleCopyCurl}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                {getCurlSnippet(current)}
              </pre>
            </div>

            {/* Interactive "Try It Out" execution sandbox */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                  Interactive API Console Sandbox
                </span>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isExecuting}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>{isExecuting ? 'Sending Request...' : 'Send Request'}</span>
                </button>
              </div>

              {measuredLatency !== null && (
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 200 OK
                  </span>
                  <span className="text-slate-500 font-mono">
                    Round-Trip Latency: <strong>{measuredLatency} ms</strong>
                  </span>
                  <span className="text-slate-500 font-mono">
                    Encoding: gzip / brotli
                  </span>
                </div>
              )}

              {/* Response display */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Response Payload:
                </span>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] max-h-52 overflow-y-auto border border-slate-800">
                  {executedResponse || JSON.stringify(current.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>OpenAPI 3.1 & REST Architecture • Optimized for sub-15ms regional delivery</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close Docs
          </button>
        </div>
      </div>
    </div>
  );
};
