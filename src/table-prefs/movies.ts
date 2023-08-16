export const url = 'https://moviesdatabase.p.rapidapi.com/titles';
export const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '40fe3f3964msh8b9c143f2817934p1d14a1jsn59f1908966bd',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
  },
};
interface Caption {
  plainText: string;
}

interface TitleText {
  text: string;
}

interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  caption: Caption;
}

interface YearRange {
  year: number;
  endYear: number | null;
}

interface TitleType {
  text: string;
  id: string;
  isSeries: boolean;
  isEpisode: boolean;
}

export interface Movie {
  _id: string;
  id: string;
  originalTitleText: TitleText;
  primaryImage: Image;
  releaseDate: Date | null;
  releaseYear: YearRange;
  titleText: TitleText;
  titleType: TitleType;
}

export interface MoviesResponse {
  page: number;
  next: string;
  entries: number;
  results: Movie[];
}

export interface SimplifiedMovie {
  _id: string;
  id: string;
  originalTitleText: string;
  releaseYear: number;
  titleText: string;
  titleType: string;
}

export interface SimplifiedMoviesResponse {
  results: SimplifiedMovie[];
}

export const simplifyMoviesData = (movies: Movie[]): SimplifiedMovie[] => {
  return movies.map(movie => ({
    _id: movie._id,
    id: movie.id,
    originalTitleText: movie.originalTitleText.text,
    releaseYear: movie.releaseYear.year,
    titleText: movie.titleText.text,
    titleType: movie.titleType.text,
  }));
};

export const getMovies = async (
  mod: string,
): Promise<MoviesResponse | undefined> => {
  try {
    const response = await fetch(`${url}?page=${mod}`, options);
    const data: MoviesResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
