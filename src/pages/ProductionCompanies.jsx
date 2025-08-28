import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductionCompanies } from '../services/movieApi';
import './ProductionCompanies.css';

function ProductionCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [paginatedCompanies, setPaginatedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'a-z', 'z-a'
  const [yearFilter, setYearFilter] = useState('all'); // 'all', 'before-1950', '1950-1980', '1980-2000', 'after-2000'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const companiesPerPage = 20;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // Fetch companies for 3 pages (60 companies total)
        const data = await getProductionCompanies(1);
        if (data && data.length > 0) {
          // Take only the first 60 companies for 3 pages
          const limitedCompanies = data.slice(0, 60);
          setCompanies(limitedCompanies);
          setFilteredCompanies(limitedCompanies);
        } else {
          setCompanies([]);
          setFilteredCompanies([]);
        }
        setError(null);
      } catch (err) {
        setError('Failed to load production companies');
        setCompanies([]);
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter and sort companies when filters change
  useEffect(() => {
    let filtered = [...companies];

    // Apply year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(company => {
        const year = company.founded_year;
        switch (yearFilter) {
          case 'before-1950':
            return year < 1950;
          case '1950-1980':
            return year >= 1950 && year < 1980;
          case '1980-2000':
            return year >= 1980 && year < 2000;
          case 'after-2000':
            return year >= 2000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortOrder === 'a-z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'z-a') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredCompanies(filtered);
  }, [companies, sortOrder, yearFilter]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * companiesPerPage;
    const endIndex = startIndex + companiesPerPage;
    const paginated = filteredCompanies.slice(startIndex, endIndex);
    setPaginatedCompanies(paginated);
  }, [filteredCompanies, currentPage, companiesPerPage]);

  const handleCompanyClick = (companyId, companyName) => {
    navigate(`/production-company/${companyId}/${encodeURIComponent(companyName)}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };



  if (loading) {
    return (
      <div className="production-companies">
        <div className="container">
          <div className="loading">Loading production companies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="production-companies">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="production-companies">
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={handleBackClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="page-title">Production Companies</h1>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="sort-select">Sort by Name:</label>
            <select 
              id="sort-select"
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="default">Default Order</option>
              <option value="a-z">A to Z</option>
              <option value="z-a">Z to A</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="year-select">Filter by Founded Year:</label>
            <select 
              id="year-select"
              value={yearFilter} 
              onChange={(e) => setYearFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Years</option>
              <option value="before-1950">Before 1950</option>
              <option value="1950-1980">1950 - 1980</option>
              <option value="1980-2000">1980 - 2000</option>
              <option value="after-2000">After 2000</option>
            </select>
          </div>
        </div>

        <div className="companies-grid">
          {paginatedCompanies && paginatedCompanies.length > 0 ? paginatedCompanies.map((company, index) => (
            <div 
              key={`${company.id}-${index}`} 
              className="company-card"
              onClick={() => handleCompanyClick(company.id, company.name)}
            >
              <div className="company-logo">
                {company.logo_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="no-logo">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 8.5C8.5 9.32843 7.82843 10 7 10C6.17157 10 5.5 9.32843 5.5 8.5C5.5 7.67157 6.17157 7 7 7C7.82843 7 8.5 7.67157 8.5 8.5Z" fill="currentColor"/>
                      <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="company-info">
                <h3 className="company-name">{company.name}</h3>
                <p className="company-origin">
                  {company.origin_country && `Origin: ${company.origin_country}`}
                </p>
                <p className="company-year">Founded: {company.founded_year}</p>
              </div>
            </div>
          )) : (
            <div className="no-companies">
              <p>No production companies found.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}
          
          <button 
            className="pagination-btn" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductionCompanies;