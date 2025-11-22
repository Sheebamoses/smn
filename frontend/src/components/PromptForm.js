import React, { useState } from 'react';
import './PromptForm.css';

const PromptForm = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="prompt">Enter your prompt:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          rows="4"
          disabled={loading}
          required
        />
      </div>
      <button 
        type="submit" 
        className="submit-button"
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Processing...' : 'Enrich & Search'}
      </button>
    </form>
  );
};

export default PromptForm;

