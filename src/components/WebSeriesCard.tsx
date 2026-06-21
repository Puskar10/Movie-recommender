'use client';

import Image from 'next/image';
import { Star, Flame, Eye, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { WebSeries } from '../types';

interface WebSeriesCardProps {
  series: WebSeries;
  onWatchTrailer: (id: string | number, type: 'movie' | 'series') => void;
}

export default function WebSeriesCard({ series, onWatchTrailer }: WebSeriesCardProps) {
  // Format watchlist count (e.g. 172000 -> 172K)
  const formatWatchlist = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  // Get color gradient based on region
  const getRegionBadgeStyles = (region: string) => {
    switch (region) {
      case 'Hollywood':
        return 'from-blue-600 to-cyan-500 text-white';
      case 'Bollywood':
        return 'from-purple-600 to-pink-500 text-white';
      case 'Tollywood':
        return 'from-amber-600 to-orange-500 text-white';
      default:
        return 'from-slate-600 to-slate-500 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative flex flex-col w-full h-[440px] rounded-2xl overflow-hidden glass border border-slate-200/50 dark:border-slate-800/40 shadow-lg transition-all duration-300 glow-card"
    >
      {/* Poster Image Container */}
      <div className="relative w-full h-[62%] overflow-hidden bg-slate-900">
        <Image
          src={series.posterUrl}
          alt={series.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          priority={false}
        />
        
        {/* Dark overlay on poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Hover Trailer Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/30 backdrop-blur-[2px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onWatchTrailer(series.id, 'series')}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 cursor-pointer"
            aria-label="Play Trailer Quick"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </motion.button>
        </div>

        {/* Region Tag */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r shadow-md shadow-black/20 ${getRegionBadgeStyles(series.region)}`}>
          {series.region}
        </span>

        {/* Release Year */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
          {series.releaseYear}
        </span>
      </div>

      {/* Details Container */}
      <div className="flex flex-col flex-grow p-4 justify-between bg-white/30 dark:bg-slate-950/30">
        <div>
          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1 mb-2">
            {series.genres.map((genre) => (
              <span key={genre} className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                • {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold line-clamp-1 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-350">
            {series.title}
          </h3>

          {/* Overview / Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3">
            {series.overview}
          </p>
        </div>

        <div>
          {/* Stats Bar */}
          <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-3">
            {/* IMDb Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{series.imdbRating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-normal">/10</span>
            </div>

            {/* Rotten Tomatoes */}
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{series.rottenTomatoes}%</span>
              <span className="text-[10px] text-slate-400 font-normal">RT</span>
            </div>

            {/* TV Show Seasons info */}
            <div className="text-[11px] font-bold text-primary dark:text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded">
              {series.seasons} Season{series.seasons > 1 ? 's' : ''}
            </div>
          </div>

          {/* Bottom Bar: Watchlist & Button */}
          <div className="flex items-center justify-between mt-3.5 gap-2">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-semibold">{formatWatchlist(series.watchlistCount)} added</span>
            </div>
            
            <button
              onClick={() => onWatchTrailer(series.id, 'series')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/10 dark:bg-white/10 hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-350 text-xs font-bold tracking-wide transition-all duration-350 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
