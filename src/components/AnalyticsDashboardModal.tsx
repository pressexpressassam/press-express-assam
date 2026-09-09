import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  Server, 
  HardDrive,
  Activity,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { Article } from '../types';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  articles,
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  if (!isOpen) return null;

  // Compute stats
  const totalViews = articles.reduce((acc, a) => acc + a.views, 0);
  const totalShares = articles.reduce((acc, a) => acc + a.shares, 0);
  const sortedByPopularity = [...articles].sort((a, b) => b.views - a.views);

  const categoryStats = [
    { name: 'Wildlife & Floods', views: '78,110', percent: 32, color: 'bg-emerald-500' },
    { name: 'Tea & Economy', views: '67,550', percent: 28, color: 'bg-amber-600' },
    { name: 'Guwahati Metro', views: '32,800', percent: 14, color: 'bg-blue-600' },
    { name: 'Sports & NEUFC', views: '31,400', percent: 13, color: 'bg-sky-500' },
    { name: 'Culture & Bihu', views: '22,100', percent: 9, color: 'bg-purple-500' },
    { name: 'Politics & Assembly', views: '18,700', percent: 4, color: 'bg-rose-500' },
  ];

  const districtTraffic = [
    { name: 'Kamrup Metropolitan (Guwahati)', readers: '41,200', pct: '38%' },
    { name: 'Dibrugarh & Tinsukia', readers: '28,400', pct: '26%' },
    { name: 'Jorhat & Golaghat', readers: '19,300', pct: '18%' },
    { name: 'Barak Valley (Cachar/Silchar)', readers: '11,500', pct: '11%' },
    { name: 'Sonitpur & Nagaon', readers: '7,800', pct: '7%' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Press Express Analytics & Content Intelligence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time readership patterns, trending topics, and edge architecture performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg flex text-[10px] font-bold border border-slate-300 dark:border-slate-700/60">
              {(['24h', '7d', '30d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 rounded ${timeRange === r ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Impressions</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                {totalViews.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs yesterday
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Live Active Readers</span>
              <p className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-1 font-mono flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                18,490
              </p>
              <span className="text-[10px] text-slate-500">Across 35 Assam districts</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">API Edge Latency</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                12 ms
              </p>
              <span className="text-[10px] text-slate-500">P99: 23ms • Global CDN</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Edge Cache Hit Rate</span>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 font-mono">
                96.4%
              </p>
              <span className="text-[10px] text-slate-500">Low-latency cached responses</span>
            </div>
          </div>

          {/* Row 2: Most Popular Stories & Category Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Trending Content */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                Top Trending Stories (Popularity Score)
              </h4>
              <div className="space-y-2.5">
                {sortedByPopularity.slice(0, 4).map((art, idx) => (
                  <div key={art.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-semibold truncate text-[11px] text-slate-900 dark:text-slate-100">
                        {art.title}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-xs">{art.views.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-400 block">reads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Interest Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Readership by Topical Vertical
              </h4>
              <div className="space-y-2.5">
                {categoryStats.map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold">{c.name}</span>
                      <span className="font-mono text-slate-500">{c.views} views ({c.percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${c.color} rounded-full`} 
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Regional Traffic in Assam & Platform Device Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Regional Traffic */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                Active Readers by Assam Regions
              </h4>
              <div className="space-y-2">
                {districtTraffic.map((dt) => (
                  <div key={dt.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-900 last:border-none">
                    <span className="text-slate-700 dark:text-slate-300">{dt.name}</span>
                    <span className="font-mono font-bold">{dt.readers} ({dt.pct})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture & Device Performance */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                API Scalability & Offline Reliability
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-500">Device Split</span>
                  <span className="font-semibold">Mobile (68%) • Desktop (24%) • Tablet (8%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-500">Offline Cache Savings</span>
                  <span className="font-semibold text-emerald-600 font-mono">14.8 MB data saved per user</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-900">
                  <span className="text-slate-500">Compression Protocol</span>
                  <span className="font-semibold">Brotli + HTTP/3 QUIC enabled</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Platform Uptime (SLA)</span>
                  <span className="font-semibold text-emerald-600 font-mono">99.98% High Availability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Automated telemetry aggregated from Assam edge nodes</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
