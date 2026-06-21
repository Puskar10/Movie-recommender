'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame, Play, Eye, Info, Volume2 } from 'lucide-react';
import Image from 'next/image';

import Navbar from '../components/Navbar';
import GenreFilter from '../components/GenreFilter';
import CinematicBg from '../components/CinematicBg';
import RegionSection from '../components/RegionSection';
import MovieSection from '../components/MovieSection';
import WebSeriesSection from '../components/WebSeriesSection';
import TrailerPlayer from '../components/TrailerPlayer';

import { ActiveTab, MediaGenre, MediaItem, Movie, WebSeries, MediaRegion } from '../types';
import { 
  getTrending, 
  getTopRated, 
  getRecommended, 
  getMediaByGenre, 
  getMediaByRegion, 
  searchMedia,
  getTrailerId 
} from '../services/movieApi';

export default function Home() {
  // Navigation & Filtering state
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [selectedGenre, setSelectedGenre] = useState<MediaGenre | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Media data state
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [recommended, setRecommended] = useState<MediaItem[]>([]);
  const [hollywood, setHollywood] = useState<MediaItem[]>([]);
  const [bollywood, setBollywood] = useState<MediaItem[]>([]);
  const [tollywood, setTollywood] = useState<MediaItem[]>([]);
  
  // Grid items for active search or genre selection
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<WebSeries[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [spotlightItem, setSpotlightItem] = useState<MediaItem | null>(null);
  const [activeTrailerId, setActiveTrailerId] = useState<string | null>(null);

  // Trigger loading data on key filter adjustments
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch recommendations & shelves
        const trendingData = await getTrending(activeTab);
        const topRatedData = await getTopRated(activeTab);
        const recommendedData = await getRecommended(activeTab);
        const hollywoodData = await getMediaByRegion('Hollywood', activeTab);
        const bollywoodData = await getMediaByRegion('Bollywood', activeTab);
        const tollywoodData = await getMediaByRegion('Tollywood', activeTab);

        setTrending(trendingData);
        setTopRated(topRatedData);
        setRecommended(recommendedData);
        setHollywood(hollywoodData);
        setBollywood(bollywoodData);
        setTollywood(tollywoodData);

        // Select a premium Spotlight hero item dynamically (e.g. highest rated in trending)
        if (trendingData.length > 0) {
          const sorted = [...trendingData].sort((a, b) => b.imdbRating - a.imdbRating);
          setSpotlightItem(sorted[0]);
        } else {
          setSpotlightItem(null);
        }

        // Handle Active filters (Grid mode)
        if (selectedGenre !== 'All') {
          const genreResults = await getMediaByGenre(selectedGenre, activeTab);
          setFilteredMovies(genreResults.filter((item): item is Movie => item.type === 'movie'));
          setFilteredSeries(genreResults.filter((item): item is WebSeries => item.type === 'series'));
        } else if (searchQuery.trim() !== '') {
          const searchResults = await searchMedia(searchQuery, activeTab);
          setFilteredMovies(searchResults.filter((item): item is Movie => item.type === 'movie'));
          setFilteredSeries(searchResults.filter((item): item is WebSeries => item.type === 'series'));
        } else {
          setFilteredMovies([]);
          setFilteredSeries([]);
        }
      } catch (err) {
        console.error('Failed to load movie recommender data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedGenre, searchQuery]);

  // Handle trailer modal trigger
  const handleWatchTrailer = async (id: string | number, type: 'movie' | 'series') => {
    try {
      const trailerKey = await getTrailerId(id, type);
      setActiveTrailerId(trailerKey);
    } catch (err) {
      console.error('Failed to get trailer key', err);
      // Fallback
      setActiveTrailerId('YoHD9XEInc0');
    }
  };

  // Determine if we should display grids (search/filters are active) or Netflix shelves
  const isFilteringActive = selectedGenre !== 'All' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <CinematicBg />

      {/* Navbar navigation controls */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSelectedGenre('All'); // Search overrides genre selection
          setSearchQuery(query);
        }}
      />

      {/* Genre list filter capsules */}
      <GenreFilter
        selectedGenre={selectedGenre}
        setSelectedGenre={(genre) => {
          setSearchQuery(''); // Genre overrides search
          setSelectedGenre(genre);
        }}
      />

      {/* Main content frame */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Main Page Loader */
            <motion.div
              key="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-[60vh] flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                Cinematic layout configuring...
              </p>
            </motion.div>
          ) : isFilteringActive ? (
            /* Search and Filter Grids */
            <motion.div
              key="filtered-grids"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="py-4"
            >
              {/* Reset search helper */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing results for{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedGenre !== 'All' ? `Genre: ${selectedGenre}` : `Search: "${searchQuery}"`}
                  </span>
                  {' '}in{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activeTab === 'all' ? 'Movies & Series' : activeTab === 'movies' ? 'Movies' : 'Web Series'}
                  </span>
                </p>
              </div>

              {/* Grid content split: Movies & Series */}
              {(activeTab === 'all' || activeTab === 'movies') && (
                <MovieSection
                  title="Movies Matching"
                  movies={filteredMovies}
                  isLoading={false}
                  onWatchTrailer={handleWatchTrailer}
                />
              )}

              {(activeTab === 'all' || activeTab === 'series') && (
                <WebSeriesSection
                  title="Web Series Matching"
                  series={filteredSeries}
                  isLoading={false}
                  onWatchTrailer={handleWatchTrailer}
                />
              )}
            </motion.div>
          ) : (
            /* Interactive Streaming Dashboard Dashboard */
            <motion.div
              key="shelves-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col"
            >
              {/* 1. Hero Showcase Banner */}
              {spotlightItem && (
                <section className="relative w-full h-[70vh] sm:h-[80vh] min-h-[500px] overflow-hidden flex items-end">
                  {/* Backdrop Background image */}
                  <div className="absolute inset-0">
                    <Image
                      src={spotlightItem.backdropUrl || spotlightItem.posterUrl}
                      alt={spotlightItem.title}
                      fill
                      priority
                      className="object-cover object-top brightness-[0.7] dark:brightness-[0.45] transition-transform duration-[12000ms] ease-out scale-102 hover:scale-100"
                    />
                    {/* Shadow masking */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/10 to-transparent" />
                  </div>

                  {/* Spotlight Item Info */}
                  <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 z-10 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-primary text-white shadow-md shadow-primary/20 uppercase tracking-widest">
                        Spotlight {spotlightItem.type === 'movie' ? 'Movie' : 'Web Series'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200/20 dark:border-white/10 shadow-sm">
                        {spotlightItem.region}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl leading-tight drop-shadow-sm">
                      {spotlightItem.title}
                    </h1>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold mt-1">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-slate-900 dark:text-slate-100">{spotlightItem.imdbRating}</span>
                        <span className="text-slate-400 font-normal">IMDb</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-red-500" />
                        <span className="text-slate-900 dark:text-slate-100">{spotlightItem.rottenTomatoes}%</span>
                        <span className="text-slate-400 font-normal">RT</span>
                      </div>
                      <div className="text-slate-400 font-normal">
                        {spotlightItem.releaseYear} • {spotlightItem.type === 'movie' 
                          ? `${Math.floor((spotlightItem as Movie).runtime / 60)}h ${(spotlightItem as Movie).runtime % 60}m`
                          : `${(spotlightItem as WebSeries).seasons} Season${(spotlightItem as WebSeries).seasons > 1 ? 's' : ''}`
                        }
                      </div>
                    </div>

                    {/* Description overview */}
                    <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 max-w-2xl mt-2 line-clamp-3 leading-relaxed drop-shadow-md">
                      {spotlightItem.overview}
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3.5 mt-5">
                      <button
                        onClick={() => handleWatchTrailer(spotlightItem.id, spotlightItem.type)}
                        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm sm:text-base transition-all duration-300 hover:bg-primary-hover shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-98 cursor-pointer"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                        <span>Watch Trailer</span>
                      </button>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-3 rounded-full border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
                        <Eye className="w-4 h-4" />
                        <span>{spotlightItem.watchlistCount.toLocaleString()} watched</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 2. Netflix-Style Carousel Categories */}
              <div className="flex flex-col gap-2 mt-4 pb-12">
                
                {/* Recommended For You Section */}
                <RegionSection
                  title="Recommended For You"
                  items={recommended}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Trending Section */}
                <RegionSection
                  title="Trending Now"
                  items={trending}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Bollywood Section */}
                <RegionSection
                  title="Bollywood Hits"
                  items={bollywood}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Hollywood Section */}
                <RegionSection
                  title="Hollywood Blocks"
                  items={hollywood}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Tollywood Section */}
                <RegionSection
                  title="Tollywood Masterpieces"
                  items={tollywood}
                  onWatchTrailer={handleWatchTrailer}
                />

                {/* Top Rated Section */}
                <RegionSection
                  title="Top Rated Cinematic Classics"
                  items={topRated}
                  onWatchTrailer={handleWatchTrailer}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/55 dark:border-slate-900/55 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-450 text-center sm:text-left">
            &copy; 2026 CineVerse. Designed and engineered for developer portfolios.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400 dark:text-slate-550 font-medium">
            <span className="hover:text-primary cursor-pointer">Terms</span>
            <span className="hover:text-primary cursor-pointer">Privacy</span>
            <span className="hover:text-primary cursor-pointer">API Docs</span>
            <span className="hover:text-primary cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>

      {/* Global Embedded YouTube Trailer Modal */}
      <TrailerPlayer
        trailerId={activeTrailerId}
        onClose={() => setActiveTrailerId(null)}
      />
    </div>
  );
}
