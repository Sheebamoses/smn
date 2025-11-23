const vectorDbService = require('./vectorDb');

/**
 * Enriches a user prompt with context from Vector DB
 */
async function enrichWithContext(prompt) {
  try {
    // Search for similar content in Vector DB to get context
    const similarContent = await vectorDbService.search(prompt, 3);
    
    if (similarContent && similarContent.length > 0) {
      // Extract context from similar content
      const contextSnippets = similarContent
        .map(item => item.payload?.text || item.payload?.description || '')
        .filter(text => text.length > 0)
        .slice(0, 2);
      
      if (contextSnippets.length > 0) {
        const context = contextSnippets.join(' ');
        return `${prompt} [Context: ${context.substring(0, 200)}...]`;
      }
    }
    
    // If no context found, return original prompt with default context
    return `${prompt} [Context: General search query]`;
  } catch (error) {
    console.error('Error enriching prompt:', error);
    // Return original prompt if enrichment fails
    return prompt;
  }
}

/**
 * Combines Vector DB results with database results and adds ratings
 */
function combineResults(vectorResults, dbResults) {
  const combined = [];
  
  // Process Vector DB results
  if (vectorResults && Array.isArray(vectorResults)) {
    vectorResults.forEach((item, index) => {
      combined.push({
        title: item.payload?.title || `Result ${index + 1}`,
        description: item.payload?.description || item.payload?.text || 'No description available',
        context: item.payload?.context || 'Vector DB match',
        rating: calculateRating(item.score || 0.5, 'vector'),
        metadata: {
          source: 'vector_db',
          score: item.score?.toFixed(3) || 'N/A',
          id: item.id || 'N/A'
        }
      });
    });
  }
  
  // Process database results
  if (dbResults && Array.isArray(dbResults)) {
    dbResults.forEach((item, index) => {
      combined.push({
        title: item.title || item.name || `Database Result ${index + 1}`,
        description: item.description || item.content || 'No description available',
        context: item.context || 'Database match',
        rating: calculateRating(item.relevance_score || 0.5, 'database'),
        metadata: {
          source: 'database',
          id: item.id || 'N/A',
          ...(item.category && { category: item.category }),
          ...(item.created_at && { created: item.created_at })
        }
      });
    });
  }
  
  // Sort by rating (highest first)
  return combined.sort((a, b) => b.rating - a.rating);
}

/**
 * Calculate rating based on score and source type
 * Ratings are on a scale of 0-5
 */
function calculateRating(score, source) {
  // Normalize score to 0-5 range
  // Vector DB scores are typically 0-1, database scores might vary
  let normalizedScore = score;
  
  if (source === 'vector') {
    // Vector DB similarity scores (0-1) -> (0-5)
    normalizedScore = score * 5;
  } else if (source === 'database') {
    // Database relevance scores (assuming 0-1 range)
    normalizedScore = Math.min(score * 5, 5);
  }
  
  // Ensure rating is between 0 and 5
  return Math.max(0, Math.min(5, normalizedScore));
}

module.exports = {
  enrichWithContext,
  combineResults
};

