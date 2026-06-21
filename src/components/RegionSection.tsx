'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../types';
import MovieCard from './MovieCard';
import WebSeriesCard from './WebSeriesCard';

interface RegionSectionProps {
  title: string;
  items: MediaItem[];
  onWatchTrailer: (id: string | number, type: 'movie' | 'series') => void;
}

export default function RegionSection({ title, items, onWatchTrailer }: RegionSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollLimits = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollLimits);
      // Run once on load to see if container is scrollable
      checkScrollLimits();
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollLimits);
    };
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      // Scroll by 75% of the screen width for a natural scrolling experience
      const scrollOffset = clientWidth * 0.75;
      const targetScroll = direction === 'left' 
        ? scrollLeft - scrollOffset 
        : scrollLeft + scrollOffset;
      
      containerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="w-full py-6 relative group/section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex justify-between items-end">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          {title}
        </h2>
        <span className="text-xs font-semibold text-primary/80 hover:text-primary cursor-pointer hover:underline transition-all">
          View All ({items.length})
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-6 top-[40%] z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-foreground shadow-lg opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-108 hover:border-primary cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-6 top-[40%] z-20 hidden md:flex items-center justify-center w-11 h-11 rounded-full border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-foreground shadow-lg opacity-0 group-hover/section:opacity-100 transition-all duration-300 hover:scale-108 hover:border-primary cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Horizontal Card Carousel */}
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth py-3 pb-5 px-1"
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="w-[280px] sm:w-[290px] md:w-[300px] flex-shrink-0"
            >
              {item.type === 'movie' ? (
                <MovieCard movie={item} onWatchTrailer={onWatchTrailer} />
              ) : (
                <WebSeriesCard series={item} onWatchTrailer={onWatchTrailer} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
