import React, { useState } from 'react';
import { VOD_ITEMS } from '../data/mockData';
import { VodItem } from '../types';
import { Play, Search, Eye, Clock, Film } from 'lucide-react';

interface VodCatalogProps {
  onWatchVideo: (item: VodItem) => void;
}

export const VodCatalog: React.FC<VodCatalogProps> = ({ onWatchVideo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Action', 'Children', 'Educational', 'Religious', 'Soul & Motown', 'Real Estate', 'Entertainment', 'Advertisements'];

  const filteredItems = VOD_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Archived Broadcasts &amp; Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Video On Demand Library
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Stream past episodes, Detroit urban ballroom showcases, commercial property tours, and S.T.E.A.R.Safe technology specials anytime.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search episodes &amp; tours..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl w-fit">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <Film className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-300 font-medium">No on-demand videos found</p>
          <p className="text-xs text-slate-500">Try adjusting your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => onWatchVideo(item)}
              className="group cursor-pointer rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all hover:bg-slate-900/80"
            >
              {/* Thumbnail Container */}
              <div className={`h-48 w-full bg-gradient-to-tr ${item.gradient} relative p-4 flex flex-col justify-between border-b border-slate-800`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.duration}
                  </span>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </span>
                </div>
              </div>

              {/* Text Info (Anti-slop zero-pill rule: unboxed metadata) */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-1">
                    <span>{item.category}</span>
                    <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                    <span>HD 1080p</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Watch Feature</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
