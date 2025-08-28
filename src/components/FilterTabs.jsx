import { useState, useEffect } from 'react';
import { getGenres } from '../services/movieApi';
import './FilterTabs.css';

const FilterTabs = ({ activeFilter, onFilterChange, yearFilter, onYearFilterChange, genreFilter, onGenreFilterChange }) => {
  const [showYearInput, setShowYearInput] = useState(false);
  const [showGenreInput, setShowGenreInput] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };
    loadGenres();
  }, []);

  const tabs = [
    { id: 'popular', label: 'Popular' },
    { id: 'a-z', label: 'A-Z' },
    { id: 'z-a', label: 'Z-A' }
  ];

  const handleTabClick = (tabId) => {
    onFilterChange(tabId);
  };

  const handleYearSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const year = formData.get('year');
    onYearFilterChange(year);
    setShowYearInput(false);
  };

  const clearYearFilter = () => {
    onYearFilterChange('');
  };

  const handleGenreSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const genreId = formData.get('genre');
    const selectedGenre = genres.find(g => g.id.toString() === genreId);
    if (selectedGenre) {
      onGenreFilterChange(selectedGenre);
    }
    setShowGenreInput(false);
  };

  const clearGenreFilter = () => {
    onGenreFilterChange(null);
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  return (
    <div className="filter-tabs">
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="genre-filter">
          {genreFilter ? (
            <div className="genre-filter-active">
              <span className="genre-tag">
                Genre: {genreFilter.name}
                <button 
                  className="remove-genre" 
                  onClick={clearGenreFilter}
                  aria-label="Remove genre filter"
                >
                  ×
                </button>
              </span>
            </div>
          ) : (
            <div className="genre-filter-input">
              {showGenreInput ? (
                <form onSubmit={handleGenreSubmit} className="genre-form">
                  <select name="genre" className="genre-select" autoFocus>
                    <option value="">Select Genre</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="apply-genre">Apply</button>
                  <button 
                    type="button" 
                    className="cancel-genre"
                    onClick={() => setShowGenreInput(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button 
                  className="genre-filter-button"
                  onClick={() => setShowGenreInput(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8H11V17H9V8ZM13 8H15V17H13V8Z"
                      fill="currentColor"
                    />
                  </svg>
                  Filter by Genre
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="year-filter">
          {yearFilter ? (
            <div className="year-filter-active">
              <span className="year-tag">
                Year: {yearFilter}
                <button 
                  className="remove-year" 
                  onClick={clearYearFilter}
                  aria-label="Remove year filter"
                >
                  ×
                </button>
              </span>
            </div>
          ) : (
            <div className="year-filter-input">
              {showYearInput ? (
                <form onSubmit={handleYearSubmit} className="year-form">
                  <select name="year" className="year-select" autoFocus>
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button type="submit" className="apply-year">Apply</button>
                  <button 
                    type="button" 
                    className="cancel-year"
                    onClick={() => setShowYearInput(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button 
                  className="year-filter-button"
                  onClick={() => setShowYearInput(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Filter by Year
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;