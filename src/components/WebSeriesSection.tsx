'use client';

import { Tv } from 'lucide-react';
import { WebSeries } from '../types';
import WebSeriesCard from './WebSeriesCard';
import { motion } from 'framer-motion';

interface WebSeriesSectionProps {
  title?: string;
  series: WebSeries[];
  isLoading: boolean;
  onWatchTrailer: (id: string | number, type: 'movie' | 'series') => void;
}

export default function WebSeriesSection({
  title,
  series,
  isLoading,
  onWatchTrailer,
}: WebSeriesSectionProps) {
  
  if (isLoading) {
    return (
      <div className="w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-[440px] rounded-2xl border border-slate-200/50 dark:border-slate-850 bg-slate-100 dark:bg-slate-900/60 animate-pulse flex flex-col justify-between p-4"
            >
              <div className="w-full h-[60%] bg-slate-250 dark:bg-slate-800/70 rounded-xl" />
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-slate-250 dark:bg-slate-800/70 rounded w-3/4" />
                <div className="h-3 bg-slate-250 dark:bg-slate-800/70 rounded w-5/6" />
                <div className="h-3 bg-slate-250 dark:bg-slate-800/70 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-250 dark:bg-slate-800/70 rounded mt-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-600 border border-slate-200/50 dark:border-slate-800/55"
        >
          <Tv className="w-8 h-8" />
        </motion.div>
        <h3 className="text-lg font-bold text-slate-850 dark:text-slate-150">No Web Series Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          We couldn't find any web series matching your current filters. Try searching for something else or changing genres.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {series.map((show) => (
          <WebSeriesCard
            key={show.id}
            series={show}
            onWatchTrailer={onWatchTrailer}
          />
        ))}
      </div>
    </div>
  );
}
