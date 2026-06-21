export type MediaRegion = 'Hollywood' | 'Bollywood' | 'Tollywood';

export type MediaGenre =
  | 'Action'
  | 'Comedy'
  | 'Drama'
  | 'Thriller'
  | 'Romance'
  | 'Horror'
  | 'Sci-Fi'
  | 'Adventure'
  | 'Crime'
  | 'Animation';

export interface BaseMedia {
  id: string | number;
  tmdbId?: number;
  title: string;
  posterUrl: string;
  backdropUrl?: string;
  imdbRating: number;
  rottenTomatoes: number;
  trailerUrl: string;
  watchlistCount: number;
  region: MediaRegion;
  genres: MediaGenre[];
  releaseYear: number;
  overview: string;
  isTrending?: boolean;
  isTopRated?: boolean;
  isRecommended?: boolean;
}

export interface Movie extends BaseMedia {
  type: 'movie';
  runtime: number;
}

export interface WebSeries extends BaseMedia {
  type: 'series';
  seasons: number;
  episodes: number;
}

export type MediaItem = Movie | WebSeries;

export type ActiveTab = 'all' | 'movies' | 'series';