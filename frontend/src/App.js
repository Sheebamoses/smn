import React, { useState } from 'react';
import './App.css';
import PromptForm from './components/PromptForm';
import ResultsList from './components/ResultsList';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (prompt) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Prompt Enrichment Application</h1>
          <p>Enter your prompt to get enriched results with context</p>
        </header>

        <PromptForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <ResultsList results={results} />
      </div>
    </div>
  );
}

export default App;

