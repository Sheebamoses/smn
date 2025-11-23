import React from 'react';
import './ResultItem.css';

const ResultItem = ({ result }) => {
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="result-item">
      <div className="result-header">
        <h3 className="result-title">{result.title || 'Untitled Result'}</h3>
        <div className="rating-container">
          <div className="rating-stars">
            {renderRating(result.rating || 0)}
          </div>
          <span className="rating-value">{result.rating?.toFixed(1) || '0.0'}</span>
        </div>
      </div>
      {result.description && (
        <p className="result-description">{result.description}</p>
      )}
      {result.context && (
        <div className="result-context">
          <strong>Context:</strong> {result.context}
        </div>
      )}
      {result.metadata && Object.keys(result.metadata).length > 0 && (
        <div className="result-metadata">
          {Object.entries(result.metadata).map(([key, value]) => (
            <span key={key} className="metadata-tag">
              {key}: {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultItem;

