import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import { searchMovies } from './services/movieApi';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import ActorFilmography from './pages/ActorFilmography';
import GenreMovies from './pages/GenreMovies';
import ProductionCompanyMovies from './pages/ProductionCompanyMovies';
import PopularActors from './pages/PopularActors';
import ProductionCompanies from './pages/ProductionCompanies';
import Genres from './pages/Genres';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import { useState } from 'react';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMovieDetailPage = location.pathname.startsWith('/movie/');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, login, logout, isLoggedIn, addToFavorites, removeFromFavorites, isFavorite: isUserFavorite } = useUser();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const handleFavoriteToggle = (movieId) => {
    if (isUserFavorite(movieId)) {
      removeFromFavorites(movieId);
    } else {
      // Note: This function expects a movie object, but we only have the ID here
      // This might need to be updated to fetch the full movie data
      addToFavorites({ id: movieId });
    }
  };

  const isFavorite = (movieId) => isUserFavorite(movieId);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="app-title">
                <a href="/">🎬 MovieSearch</a>
              </h1>
            </div>
            
            <div className="header-center">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="header-right">
              <button 
                className="home-button"
                onClick={() => {
                  console.log('Home button clicked!');
                  navigate('/');
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Home
              </button>
              
              <div className="main-dropdown">
                <button 
                  className="dropdown-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Menu
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {/* Login Section */}
                    <div className="dropdown-section">
                      <h4 className="dropdown-section-title">Account</h4>
                      <div className="dropdown-login">
                        <Login />
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    {/* Favorites Section */}
                    {isMovieDetailPage && (
                      <>
                        <div className="dropdown-section">
                          <h4 className="dropdown-section-title">Favorites</h4>
                          <button 
                            className="dropdown-item favorite-btn"
                            onClick={() => {
                              const movieId = location.pathname.split('/movie/')[1];
                              if (movieId) handleFavoriteToggle(parseInt(movieId));
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite(parseInt(location.pathname.split('/movie/')[1])) ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {isFavorite(parseInt(location.pathname.split('/movie/')[1])) ? 'Remove from Favorites' : 'Add to Favorites'}
                          </button>
                        </div>
                        
                        <div className="dropdown-divider"></div>
                      </>
                    )}
                    
                    {/* Browse Section */}
                    <div className="dropdown-section">
                      <h4 className="dropdown-section-title">Browse</h4>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/genres');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Genres
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/actors');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Actors
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => {
                          navigate('/production-companies');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 8.5C8.5 9.32843 7.82843 10 7 10C6.17157 10 5.5 9.32843 5.5 8.5C5.5 7.67157 6.17157 7 7 7C7.82843 7 8.5 7.67157 8.5 8.5Z" fill="currentColor"/>
                          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Production Companies
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/actor/:actorId" element={<ActorFilmography />} />
          <Route path="/genre/:genreId/:genreName" element={<GenreMovies />} />
          <Route path="/production-company/:companyId/:companyName" element={<ProductionCompanyMovies />} />
          <Route path="/actors" element={<PopularActors />} />
          <Route path="/production-companies" element={<ProductionCompanies />} />
          <Route path="/genres" element={<Genres />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 MovieSearch. Powered by The Movie Database (TMDB)</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router basename="/MS-3">
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App
