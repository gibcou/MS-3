import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('movieAppUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('movieAppUser');
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('movieAppUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('movieAppUser');
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('movieAppUser', JSON.stringify(newUserData));
  };

  const addToFavorites = (movie) => {
    if (!isLoggedIn || !user) return false;
    
    const isAlreadyFavorite = user.favorites?.some(fav => fav.id === movie.id);
    if (isAlreadyFavorite) return false;
    
    const updatedFavorites = [...(user.favorites || []), movie];
    updateUser({ favorites: updatedFavorites });
    return true;
  };

  const removeFromFavorites = (movieId) => {
    if (!isLoggedIn || !user) return false;
    
    const updatedFavorites = (user.favorites || []).filter(fav => fav.id !== movieId);
    updateUser({ favorites: updatedFavorites });
    return true;
  };

  const isFavorite = (movieId) => {
    if (!isLoggedIn || !user) return false;
    return user.favorites?.some(fav => fav.id === movieId) || false;
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    updateUser,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: user?.favorites?.length || 0
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};