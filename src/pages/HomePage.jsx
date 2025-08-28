import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchMovies, searchActors, searchCompanies, multiSearch, getPopularMovies, sortMoviesAlphabetically, filterMoviesByYear, getMoviesByGenre, getImageUrl } from '../services/movieApi';
import MovieCard from '../components/MovieCard';
import ActorCard from '../components/ActorCard';
import CompanyCard from '../components/CompanyCard';
import FilterTabs from '../components/FilterTabs';
import './HomePage.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [activeFilter, setActiveFilter] = useState('popular');
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      handleSearch(searchParam);
      // Clear the search param from URL after handling
      setSearchParams({});
    } else {
      loadPopularMovies();
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [movies, activeFilter, yearFilter, genreFilter, sortOrder]);

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const data = await getPopularMovies();
      setMovies(data.results || []);
      setActiveFilter('popular');
    } catch (error) {
      console.error('Error loading popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, searchTypeParam = 'all') => {
    if (!query.trim()) {
      setSearchQuery('');
      setSearchType('all');
      setActiveFilter('popular');
      loadPopularMovies();
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    setSearchType(searchTypeParam);
    try {
      let data;
      switch (searchTypeParam) {
        case 'movies':
          data = await searchMovies(query);
          break;
        case 'actors':
          data = await searchActors(query);
          break;
        case 'companies':
          data = await searchCompanies(query);
          break;
        case 'all':
        default:
          data = await multiSearch(query);
          break;
      }
      setMovies(data.results || []);
      setActiveFilter('search');
      // Clear filters when searching
      setYearFilter('');
      setGenreFilter(null);
    } catch (error) {
      console.error('Error searching:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Apply year filter
    if (yearFilter) {
      filtered = filterMoviesByYear(filtered, yearFilter);
    }

    // Apply genre filter
    if (genreFilter) {
      filtered = filtered.filter(movie => 
        movie.genre_ids && movie.genre_ids.includes(genreFilter.id)
      );
    }

    // Apply alphabetical sorting
    if (activeFilter === 'a-z' || activeFilter === 'z-a') {
      const order = activeFilter === 'a-z' ? 'asc' : 'desc';
      filtered = sortMoviesAlphabetically(filtered, order);
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'popular' && !searchQuery) {
      loadPopularMovies();
    }
  };

  const handleGenreFilterChange = async (genre) => {
    if (genre) {
      setLoading(true);
      try {
        const data = await getMoviesByGenre(genre.id, genre.name);
        setMovies(data.results || []);
        setGenreFilter(genre);
        setActiveFilter('genre');
        // Clear search and year filter when filtering by genre
        setSearchQuery('');
        setYearFilter('');
      } catch (error) {
        console.error('Error loading movies by genre:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setGenreFilter(null);
      if (activeFilter === 'genre') {
        setActiveFilter('popular');
        loadPopularMovies();
      }
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Movies</h1>
          <p className="hero-subtitle">
            Search through thousands of movies, filter by year, and explore detailed information
          </p>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Filter Section */}
      <section className="filters">
        <div className="container">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            genreFilter={genreFilter}
            onGenreFilterChange={handleGenreFilterChange}
          />
        </div>
      </section>

      {/* Movies Grid */}
      <section className="movies-section">
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : (
            <>
              <div className="movies-header">
                <h2>
                  {activeFilter === 'popular' && !searchQuery && 'Popular Movies'}
                  {activeFilter === 'search' && searchType === 'movies' && `Movie Results for "${searchQuery}"`}
                  {activeFilter === 'search' && searchType === 'actors' && `Actor Results for "${searchQuery}"`}
                  {activeFilter === 'search' && searchType === 'companies' && `Company Results for "${searchQuery}"`}
                  {activeFilter === 'search' && searchType === 'all' && `Search Results for "${searchQuery}"`}
                  {activeFilter === 'a-z' && 'Movies A-Z'}
                  {activeFilter === 'z-a' && 'Movies Z-A'}
                  {activeFilter === 'genre' && genreFilter && `${genreFilter.name} Movies`}
                </h2>
                <p className="movies-count">
                  {activeFilter === 'search' && searchType === 'actors' ? `${filteredMovies.length} actors found` :
                   activeFilter === 'search' && searchType === 'companies' ? `${filteredMovies.length} companies found` :
                   `${filteredMovies.length} ${searchType === 'all' && activeFilter === 'search' ? 'results' : 'movies'} found`}
                </p>
              </div>
              
              <div className="movies-grid">
                {filteredMovies.map((item) => {
                  // For multi-search results, check the media_type
                  if (activeFilter === 'search' && searchType === 'all') {
                    if (item.media_type === 'person') {
                      return (
                        <ActorCard
                          key={`actor-${item.id}`}
                          actor={item}
                          onClick={() => navigate(`/actor/${item.id}`)}
                        />
                      );
                    } else if (item.media_type === 'movie') {
                      return (
                        <MovieCard
                          key={`movie-${item.id}`}
                          movie={item}
                          onClick={() => handleMovieClick(item.id)}
                        />
                      );
                    }
                    return null;
                  }
                  
                  // For specific search types
                  if (activeFilter === 'search' && searchType === 'actors') {
                    return (
                      <ActorCard
                        key={`actor-${item.id}`}
                        actor={item}
                        onClick={() => navigate(`/actor/${item.id}`)}
                      />
                    );
                  }
                  
                  if (activeFilter === 'search' && searchType === 'companies') {
                    return (
                      <CompanyCard
                        key={`company-${item.id}`}
                        company={item}
                        onClick={() => navigate(`/production-company/${item.id}/${encodeURIComponent(item.name)}`)}
                      />
                    );
                  }
                  
                  // Default to MovieCard for movies and other cases
                  return (
                    <MovieCard
                      key={`movie-${item.id}`}
                      movie={item}
                      onClick={() => handleMovieClick(item.id)}
                    />
                  );
                })}
              </div>
              
              {filteredMovies.length === 0 && !loading && (
                <div className="no-results">
                  <h3>
                    {activeFilter === 'search' && searchType === 'actors' ? 'No actors found' :
                     activeFilter === 'search' && searchType === 'companies' ? 'No companies found' :
                     'No results found'}
                  </h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;