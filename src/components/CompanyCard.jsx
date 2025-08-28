import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../services/movieApi';
import './CompanyCard.css';

const CompanyCard = ({ company, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(company);
    } else {
      navigate(`/production-company/${company.id}/${encodeURIComponent(company.name)}`);
    }
  };

  return (
    <div className="company-card" onClick={handleClick}>
      <div className="company-poster">
        {company.logo_path ? (
          <img
            className="poster-image"
            src={getImageUrl(company.logo_path)}
            alt={company.name}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
            </svg>
            <span>No Logo</span>
          </div>
        )}
      </div>
      
      <div className="company-info">
        <h3 className="company-name">{company.name}</h3>
        {company.origin_country && (
          <p className="company-country">{company.origin_country}</p>
        )}
        <p className="company-type">Production Company</p>
      </div>
      
      <div className="company-card-overlay">
        <div className="overlay-content">
          <h3>{company.name}</h3>
          <p>Click to view movies</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;