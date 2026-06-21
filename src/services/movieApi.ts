import { MediaItem, MediaGenre, MediaRegion, ActiveTab } from '../types';
import { mockMediaItems } from '../data/mockData';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const POSTER_FALLBACK =
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop';

const BACKDROP_FALLBACK =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const MOVIE_GENRE_MAP: Record<MediaGenre, number> = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Thriller: 53,
  Romance: 10749,
  Horror: 27,
  'Sci-Fi': 878,
  Adventure: 12,
  Crime: 80,
  Animation: 16,
};

const TV_GENRE_MAP: Record<MediaGenre, number> = {
  Action: 10759,
  Comedy: 35,
  Drama: 18,
  Thriller: 9648,
  Romance: 10766,
  Horror: 9648,
  'Sci-Fi': 10765,
  Adventure: 10759,
  Crime: 80,
  Animation: 16,
};

const REVERSE_MOVIE_GENRE_MAP: Record<number, MediaGenre> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  27: 'Horror',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
};

const REVERSE_TV_GENRE_MAP: Record<number, MediaGenre> = {
  10759: 'Action',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  9648: 'Thriller',
  10765: 'Sci-Fi',
  10766: 'Romance',
};

type TMDBResult = {
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  original_language?: string;
  origin_country?: string[];
};

const useTMDB = (): boolean => {
  return Boolean(TMDB_API_KEY);
};

async function fetchFromTMDB(
  endpoint: string,
  queryParams: Record<string, string | number | boolean> = {}
) {
  if (!TMDB_API_KEY) {
    throw new Error('Missing NEXT_PUBLIC_TMDB_API_KEY');
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    include_adult: 'false',
    ...Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    ),
  });

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${params}`);

  if (!response.ok) {
    throw new Error(`TMDB fetch failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchPagesFromTMDB(
  endpoint: string,
  queryParams: Record<string, string | number | boolean> = {},
  pages = 3
) {
  const requests = Array.from({ length: pages }, (_, index) => {
    return fetchFromTMDB(endpoint, {
      ...queryParams,
      page: index + 1,
    });
  });

  const responses = await Promise.all(requests);

  return responses.flatMap((data) => data.results || []);
}

function getPosterUrl(path?: string | null) {
  return path ? `${IMAGE_BASE}/w500${path}` : POSTER_FALLBACK;
}

function getBackdropUrl(path?: string | null) {
  return path ? `${IMAGE_BASE}/w1280${path}` : BACKDROP_FALLBACK;
}

function getRegion(item: TMDBResult): MediaRegion {
  const language = item.original_language;
  const countries = item.origin_country || [];

  if (language === 'hi' || countries.includes('IN')) {
    return 'Bollywood';
  }

  if (language === 'te' || language === 'ta' || language === 'kn' || language === 'ml') {
    return 'Tollywood';
  }

  return 'Hollywood';
}

function getMovieGenres(ids: number[] = []): MediaGenre[] {
  const genres = ids
    .map((id) => REVERSE_MOVIE_GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3);

  return genres.length > 0 ? genres : ['Drama'];
}

function getTVGenres(ids: number[] = []): MediaGenre[] {
  const genres = ids
    .map((id) => REVERSE_TV_GENRE_MAP[id])
    .filter(Boolean)
    .slice(0, 3);

  return genres.length > 0 ? genres : ['Drama'];
}

function fakeRottenTomatoes(voteAverage = 7) {
  return Math.min(
    100,
    Math.max(30, Math.round(voteAverage * 10 + (voteAverage >= 7.5 ? 5 : -4)))
  );
}

function fakeWatchlistCount(voteCount = 100, popularity = 20) {
  return Math.round(voteCount * 8 + popularity * 120 + 1000);
}

function getYear(date?: string) {
  if (!date) return 2024;

  const year = new Date(date).getFullYear();

  return Number.isNaN(year) ? 2024 : year;
}

function transformMovie(movie: TMDBResult): MediaItem {
  const voteAverage = movie.vote_average || 7;
  const voteCount = movie.vote_count || 100;
  const popularity = movie.popularity || 20;

  return {
    id: `movie-${movie.id}`,
    tmdbId: movie.id,
    type: 'movie',
    title: movie.title || movie.original_title || 'Untitled Movie',
    posterUrl: getPosterUrl(movie.poster_path),
    backdropUrl: getBackdropUrl(movie.backdrop_path),
    imdbRating: Number(voteAverage.toFixed(1)),
    rottenTomatoes: fakeRottenTomatoes(voteAverage),
    runtime: 120,
    trailerUrl: '',
    watchlistCount: fakeWatchlistCount(voteCount, popularity),
    region: getRegion(movie),
    genres: getMovieGenres(movie.genre_ids),
    releaseYear: getYear(movie.release_date),
    overview: movie.overview || 'No overview available.',
    isTrending: popularity > 50,
    isTopRated: voteAverage >= 7.8,
    isRecommended: voteAverage >= 7.2,
  };
}

function transformTVShow(show: TMDBResult): MediaItem {
  const voteAverage = show.vote_average || 7;
  const voteCount = show.vote_count || 100;
  const popularity = show.popularity || 20;

  return {
    id: `series-${show.id}`,
    tmdbId: show.id,
    type: 'series',
    title: show.name || show.original_name || 'Untitled Show',
    posterUrl: getPosterUrl(show.poster_path),
    backdropUrl: getBackdropUrl(show.backdrop_path),
    imdbRating: Number(voteAverage.toFixed(1)),
    rottenTomatoes: fakeRottenTomatoes(voteAverage),
    seasons: 2,
    episodes: 20,
    trailerUrl: '',
    watchlistCount: fakeWatchlistCount(voteCount, popularity),
    region: getRegion(show),
    genres: getTVGenres(show.genre_ids),
    releaseYear: getYear(show.first_air_date),
    overview: show.overview || 'No overview available.',
    isTrending: popularity > 40,
    isTopRated: voteAverage >= 7.8,
    isRecommended: voteAverage >= 7.2,
  };
}

function removeDuplicates(items: MediaItem[]) {
  const map = new Map<MediaItem['id'], MediaItem>();

  items.forEach((item) => {
    map.set(item.id, item);
  });

  return Array.from(map.values());
}

function filterMockByType(type: ActiveTab) {
  return mockMediaItems.filter((item) => {
    if (type === 'movies') return item.type === 'movie';
    if (type === 'series') return item.type === 'series';
    return true;
  });
}

export async function getTrending(type: ActiveTab = 'all'): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      let results: MediaItem[] = [];

      if (type === 'all' || type === 'movies') {
        const movies = await fetchPagesFromTMDB('/trending/movie/week', {}, 2);
        results.push(...movies.map(transformMovie));
      }

      if (type === 'all' || type === 'series') {
        const shows = await fetchPagesFromTMDB('/trending/tv/week', {}, 2);
        results.push(...shows.map(transformTVShow));
      }

      return removeDuplicates(results).sort(
        (a, b) => b.watchlistCount - a.watchlistCount
      );
    } catch (error) {
      console.error('Error fetching trending from TMDB:', error);
    }
  }

  return filterMockByType(type).filter((item) => item.isTrending);
}

export async function getTopRated(type: ActiveTab = 'all'): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      let results: MediaItem[] = [];

      if (type === 'all' || type === 'movies') {
        const movies = await fetchPagesFromTMDB(
          '/movie/top_rated',
          {
            sort_by: 'vote_average.desc',
          },
          2
        );

        results.push(...movies.map(transformMovie));
      }

      if (type === 'all' || type === 'series') {
        const shows = await fetchPagesFromTMDB(
          '/tv/top_rated',
          {
            sort_by: 'vote_average.desc',
          },
          2
        );

        results.push(...shows.map(transformTVShow));
      }

      return removeDuplicates(results).sort((a, b) => b.imdbRating - a.imdbRating);
    } catch (error) {
      console.error('Error fetching top rated from TMDB:', error);
    }
  }

  return filterMockByType(type).filter((item) => item.isTopRated);
}

export async function getPopular(type: ActiveTab = 'all'): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      let results: MediaItem[] = [];

      if (type === 'all' || type === 'movies') {
        const movies = await fetchPagesFromTMDB('/movie/popular', {}, 3);
        results.push(...movies.map(transformMovie));
      }

      if (type === 'all' || type === 'series') {
        const shows = await fetchPagesFromTMDB('/tv/popular', {}, 3);
        results.push(...shows.map(transformTVShow));
      }

      return removeDuplicates(results).sort(
        (a, b) => b.watchlistCount - a.watchlistCount
      );
    } catch (error) {
      console.error('Error fetching popular from TMDB:', error);
    }
  }

  return filterMockByType(type);
}

export async function getRecommended(type: ActiveTab = 'all'): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      const popular = await getPopular(type);

      return popular
        .filter((item) => item.imdbRating >= 6.5)
        .sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error fetching recommended from TMDB:', error);
    }
  }

  return filterMockByType(type).filter((item) => item.isRecommended);
}

export async function getMediaByGenre(
  genre: MediaGenre,
  type: ActiveTab = 'all'
): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      let results: MediaItem[] = [];

      if (type === 'all' || type === 'movies') {
        const movieGenreId = MOVIE_GENRE_MAP[genre];

        const movies = await fetchPagesFromTMDB(
          '/discover/movie',
          {
            with_genres: movieGenreId,
            sort_by: 'popularity.desc',
          },
          3
        );

        results.push(...movies.map(transformMovie));
      }

      if (type === 'all' || type === 'series') {
        const tvGenreId = TV_GENRE_MAP[genre];

        const shows = await fetchPagesFromTMDB(
          '/discover/tv',
          {
            with_genres: tvGenreId,
            sort_by: 'popularity.desc',
          },
          3
        );

        results.push(...shows.map(transformTVShow));
      }

      return removeDuplicates(results);
    } catch (error) {
      console.error(`Error fetching ${genre} from TMDB:`, error);
    }
  }

  return filterMockByType(type).filter((item) => item.genres.includes(genre));
}

export async function getMediaByRegion(
  region: MediaRegion,
  type: ActiveTab = 'all'
): Promise<MediaItem[]> {
  if (useTMDB()) {
    try {
      let language = 'en';

      if (region === 'Bollywood') language = 'hi';
      if (region === 'Tollywood') language = 'te';

      let results: MediaItem[] = [];

      if (type === 'all' || type === 'movies') {
        const movies = await fetchPagesFromTMDB(
          '/discover/movie',
          {
            with_original_language: language,
            sort_by: 'popularity.desc',
          },
          3
        );

        results.push(...movies.map(transformMovie));
      }

      if (type === 'all' || type === 'series') {
        const shows = await fetchPagesFromTMDB(
          '/discover/tv',
          {
            with_original_language: language,
            sort_by: 'popularity.desc',
          },
          3
        );

        results.push(...shows.map(transformTVShow));
      }

      return removeDuplicates(results);
    } catch (error) {
      console.error(`Error fetching ${region} from TMDB:`, error);
    }
  }

  return filterMockByType(type).filter((item) => item.region === region);
}

export async function searchMedia(
  query: string,
  type: ActiveTab = 'all'
): Promise<MediaItem[]> {
  const cleanQuery = query.trim();

  if (!cleanQuery) return [];

  if (useTMDB()) {
    try {
      let results: MediaItem[] = [];

      if (type === 'all') {
        const data = await fetchFromTMDB('/search/multi', {
          query: cleanQuery,
          page: 1,
        });

        const filtered = (data.results || []).filter((item: any) => {
          return item.media_type === 'movie' || item.media_type === 'tv';
        });

        results = filtered.map((item: any) => {
          if (item.media_type === 'movie') return transformMovie(item);
          return transformTVShow(item);
        });
      }

      if (type === 'movies') {
        const data = await fetchFromTMDB('/search/movie', {
          query: cleanQuery,
          page: 1,
        });

        results = (data.results || []).map(transformMovie);
      }

      if (type === 'series') {
        const data = await fetchFromTMDB('/search/tv', {
          query: cleanQuery,
          page: 1,
        });

        results = (data.results || []).map(transformTVShow);
      }

      return removeDuplicates(results);
    } catch (error) {
      console.error('Error searching TMDB:', error);
    }
  }

  return filterMockByType(type).filter((item) => {
    const lowerQuery = cleanQuery.toLowerCase();

    return (
      item.title.toLowerCase().includes(lowerQuery) ||
      item.overview.toLowerCase().includes(lowerQuery) ||
      item.genres.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
      item.region.toLowerCase().includes(lowerQuery)
    );
  });
}

export async function getTrailerId(
  id: string | number,
  type: 'movie' | 'series'
): Promise<string> {
  const mockItem = mockMediaItems.find((item) => item.id === id);

  if (mockItem?.trailerUrl) {
    return mockItem.trailerUrl;
  }

  if (useTMDB()) {
    try {
      const tmdbId =
        typeof id === 'string'
          ? id.replace('movie-', '').replace('series-', '')
          : id;

      const endpoint =
        type === 'movie' ? `/movie/${tmdbId}/videos` : `/tv/${tmdbId}/videos`;

      const data = await fetchFromTMDB(endpoint);
      const videos = data.results || [];

      const trailer = videos.find((video: any) => {
        return video.site === 'YouTube' && video.type === 'Trailer';
      });

      if (trailer?.key) return trailer.key;

      const teaser = videos.find((video: any) => {
        return video.site === 'YouTube' && video.type === 'Teaser';
      });

      if (teaser?.key) return teaser.key;

      const youtubeVideo = videos.find((video: any) => {
        return video.site === 'YouTube';
      });

      if (youtubeVideo?.key) return youtubeVideo.key;
    } catch (error) {
      console.error(`Error fetching trailer for ${type} ${id}:`, error);
    }
  }

  return 'YoHD9XEInc0';
}