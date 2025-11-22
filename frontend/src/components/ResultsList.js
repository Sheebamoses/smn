import React from 'react';
import './ResultsList.css';
import ResultItem from './ResultItem';

const ResultsList = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="results-list">
      <h2 className="results-title">Search Results</h2>
      <div className="results-container">
        {results.map((result, index) => (
          <ResultItem key={index} result={result} />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;

