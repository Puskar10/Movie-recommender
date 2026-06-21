'use client';

import { motion } from 'framer-motion';
import { MediaGenre } from '../types';

interface GenreFilterProps {
  selectedGenre: MediaGenre | 'All';
  setSelectedGenre: (genre: MediaGenre | 'All') => void;
}

export default function GenreFilter({ selectedGenre, setSelectedGenre }: GenreFilterProps) {
  const genres: (MediaGenre | 'All')[] = [
    'All',
    'Action',
    'Comedy',
    'Drama',
    'Thriller',
    'Romance',
    'Horror',
    'Sci-Fi',
    'Adventure',
    'Crime',
    'Animation',
  ];

  return (
    <div className="w-full py-4 border-b border-slate-200/30 dark:border-slate-900/40 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                id={`genre-btn-${genre.replace(/\s+/g, '-').replace('&', 'and').toLowerCase()}`}
                onClick={() => setSelectedGenre(genre)}
                className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 border ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGenreIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-violet-600 rounded-full -z-10 shadow-md shadow-primary/20"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                <span>{genre}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
