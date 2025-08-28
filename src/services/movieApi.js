const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // Free TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Search movies by title
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Search actors by name
export const searchActors = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching actors:', error);
    throw error;
  }
};

// Search production companies by name
export const searchCompanies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/company?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};

// Multi-search function that searches movies, actors, and companies
export const multiSearch = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing multi-search:', error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,external_ids`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Discover movies with filters
export const discoverMovies = async (filters = {}, page = 1) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    page: page.toString(),
    ...filters
  });
  
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};

// Helper function to get full image URL
export const getImageUrl = (path) => {
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};

// Helper function to get IMDB URL
export const getImdbUrl = (imdbId) => {
  return imdbId ? `https://www.imdb.com/title/${imdbId}` : null;
};

// Sort movies alphabetically
export const sortMoviesAlphabetically = (movies, order = 'asc') => {
  return [...movies].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    
    if (order === 'asc') {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });
};

// Filter movies by year
export const filterMoviesByYear = (movies, year) => {
  if (!year) return movies;
  
  return movies.filter(movie => {
    const movieYear = new Date(movie.release_date).getFullYear();
    return movieYear === parseInt(year);
  });
};

// Get actor details and their movies
export const getActorDetails = async (actorId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&append_to_response=movie_credits`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching actor details:', error);
    throw error;
  }
};

// Get movies by actor ID
export const getMoviesByActor = async (actorId) => {
  try {
    const actorData = await getActorDetails(actorId);
    return {
      actor: {
        id: actorData.id,
        name: actorData.name,
        profile_path: actorData.profile_path,
        biography: actorData.biography,
        birthday: actorData.birthday,
        place_of_birth: actorData.place_of_birth
      },
      movies: actorData.movie_credits?.cast || []
    };
  } catch (error) {
    console.error('Error fetching movies by actor:', error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, genreName, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return {
      genre: {
        id: genreId,
        name: genreName
      },
      ...data
    };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Get all movie genres
export const getGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    
    // Map genre names to more appropriate display names
    const genreNameMapping = {
      'TV Movie': 'TV Shows'
    };
    
    // Apply name mapping to genres
    const mappedGenres = data.genres.map(genre => ({
      ...genre,
      name: genreNameMapping[genre.name] || genre.name
    }));
    
    return mappedGenres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Get popular production companies
export const getProductionCompanies = async (page = 1) => {
  try {
    // Return a comprehensive list of major production companies with their logos
    const majorCompanies = [
      { id: 1, name: "Lucasfilm Ltd.", logo_path: "/o86DbpburjxrqAzEDhXZcyE8pDb.png", origin_country: "US", founded_year: 1971 },
      { id: 2, name: "Walt Disney Pictures", logo_path: "/wdrCwmRnLFJehXdsjJNVOwRtpb.png", origin_country: "US", founded_year: 1923 },
      { id: 3, name: "Pixar Animation Studios", logo_path: "/1TjvGVDMYsj6JBxOAkWRf2hFouw.png", origin_country: "US", founded_year: 1986 },
      { id: 4, name: "Marvel Studios", logo_path: "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png", origin_country: "US", founded_year: 1993 },
      { id: 5, name: "Warner Bros. Pictures", logo_path: "/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png", origin_country: "US", founded_year: 1923 },
      { id: 6, name: "Universal Pictures", logo_path: "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png", origin_country: "US", founded_year: 1912 },
      { id: 7, name: "Columbia Pictures", logo_path: "/71BqEFAF4V3qjjMPCpLuyJFB9A.png", origin_country: "US", founded_year: 1924 },
      { id: 8, name: "Paramount Pictures", logo_path: "/gz66EfNoYPqHTYI4q9UEN4CbHRc.png", origin_country: "US", founded_year: 1912 },
      { id: 9, name: "20th Century Studios", logo_path: "/qZCc1lty5FzX30aOCVRBLzaVmcp.png", origin_country: "US", founded_year: 1935 },
      { id: 10, name: "DreamWorks Pictures", logo_path: "/vru2SssLX3FPhnKZGtYw00pVIS9.png", origin_country: "US", founded_year: 1994 },
      { id: 11, name: "New Line Cinema", logo_path: "/liW0mjvTyLs7UCumaHhx3PpU4VT.png", origin_country: "US", founded_year: 1967 },
      { id: 12, name: "Lionsgate", logo_path: "/cisLn1YAUuptXVBa0xjq7ST9cH0.png", origin_country: "US", founded_year: 1997 },
      { id: 13, name: "A24", logo_path: "/258hO1u9s78RbklYd0iyJDZVOTI.png", origin_country: "US", founded_year: 2012 },
      { id: 14, name: "Netflix", logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png", origin_country: "US", founded_year: 1997 },
      { id: 15, name: "Amazon Studios", logo_path: "/sVBEF7q7LqjHAWSnKwDbzmr2EMY.png", origin_country: "US", founded_year: 2010 },
      { id: 16, name: "Studio Ghibli", logo_path: "/8M99Dkt23MjQMTTfXD7YLxLDxIx.png", origin_country: "JP", founded_year: 1985 },
      { id: 17, name: "Legendary Entertainment", logo_path: "/cisLn1YAUuptXVBa0xjq7ST9cH0.png", origin_country: "US", founded_year: 2000 },
      { id: 18, name: "Blumhouse Productions", logo_path: "/liW0mjvTyLs7UCumaHhx3PpU4VT.png", origin_country: "US", founded_year: 2000 },
      { id: 19, name: "Focus Features", logo_path: "/2Tc1P3Ac8M479naPp1kYT3izLS5.png", origin_country: "US", founded_year: 2002 },
      { id: 20, name: "Searchlight Pictures", logo_path: "/hD8yEGUBlHOcfHYbujp71vD8gZp.png", origin_country: "US", founded_year: 1994 },
      { id: 21, name: "Sony Pictures", logo_path: "/GagSvqWlyPdkFHMfQ3pNq6ix9P.png", origin_country: "US", founded_year: 1987 },
      { id: 22, name: "MGM", logo_path: "/7cxRWzi4LsVm4Utfpr1hfARNurT.png", origin_country: "US", founded_year: 1924 },
      { id: 23, name: "Miramax", logo_path: "/esmzky6ResykHr1P3bZ8aEjest3.png", origin_country: "US", founded_year: 1979 },
      { id: 24, name: "Working Title Films", logo_path: "/yHUEdxtpQAYpPzs5IXe2x2aAzxr.png", origin_country: "GB", founded_year: 1983 },
      { id: 25, name: "Relativity Media", logo_path: "/258hO1u9s78RbklYd0iyJDZVOTI.png", origin_country: "US", founded_year: 2004 },
      { id: 26, name: "Village Roadshow Pictures", logo_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png", origin_country: "AU", founded_year: 1986 },
      { id: 27, name: "Amblin Entertainment", logo_path: "/m4ZRDQ5mnbaGzs6Q2XLlGFbXvCN.png", origin_country: "US", founded_year: 1981 },
      { id: 28, name: "Bad Robot", logo_path: "/1wP1phHo2CROOqzv7Azs0MT5esU.png", origin_country: "US", founded_year: 2001 },
      { id: 29, name: "Plan B Entertainment", logo_path: "/kP7t6RwGz2AvvTkvnI1uteEwHet.png", origin_country: "US", founded_year: 2001 },
      { id: 30, name: "Imagine Entertainment", logo_path: "/3hV8pyxzAJOWvQiWpwbDRqyLSoU.png", origin_country: "US", founded_year: 1986 },
      { id: 31, name: "Jerry Bruckheimer Films", logo_path: "/tVPmo07IHhBs4HuilrcV0yujsZ9.png", origin_country: "US", founded_year: 1995 },
      { id: 32, name: "Skydance Media", logo_path: "/nPHuTL1hkyqUqpW4s9Su9bwAEfN.png", origin_country: "US", founded_year: 2010 },
      { id: 33, name: "Annapurna Pictures", logo_path: "/dlbHzcX5OxCxbaBc2XH6wMNbY6J.png", origin_country: "US", founded_year: 2011 },
      { id: 34, name: "FilmNation Entertainment", logo_path: "/yL3xRp4f0u8r4J8bYvjUn5cfYWd.png", origin_country: "US", founded_year: 2008 },
      { id: 35, name: "Neon", logo_path: "/6J2nwlkQkJinjTJdgZXzWoJp3GK.png", origin_country: "US", founded_year: 2017 },
      { id: 36, name: "STX Entertainment", logo_path: "/GagSvqWlyPdkFHMfQ3pNq6ix9P.png", origin_country: "US", founded_year: 2014 },
      { id: 37, name: "Bleecker Street", logo_path: "/7cxRWzi4LsVm4Utfpr1hfARNurT.png", origin_country: "US", founded_year: 2014 },
      { id: 38, name: "IFC Films", logo_path: "/esmzky6ResykHr1P3bZ8aEjest3.png", origin_country: "US", founded_year: 2000 },
      { id: 39, name: "The Weinstein Company", logo_path: "/yHUEdxtpQAYpPzs5IXe2x2aAzxr.png", origin_country: "US", founded_year: 2005 },
      { id: 40, name: "Magnolia Pictures", logo_path: "/nPHuTL1hkyqUqpW4s9Su9bwAEfN.png", origin_country: "US", founded_year: 2001 }
    ];
    
    // Return all companies (no pagination)
    return majorCompanies;
  } catch (error) {
    console.error('Error fetching production companies:', error);
    throw error;
  }
};

// Get movies by production company
export const getMoviesByProductionCompany = async (companyId, companyName, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=${companyId}&page=${page}&sort_by=popularity.desc`
    );
    const data = await response.json();
    return {
      ...data,
      companyName: companyName
    };
  } catch (error) {
    console.error('Error fetching movies by production company:', error);
    throw error;
  }
};

// Get popular actors
export const getPopularActors = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular actors:', error);
    throw error;
  }
};