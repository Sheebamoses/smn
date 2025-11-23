const { Pool } = require('pg');

let pool = null;

/**
 * Initialize PostgreSQL connection pool
 */
function initialize() {
  if (pool) {
    return Promise.resolve();
  }

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'prompt_enrichment',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  // Create tables if they don't exist
  return createTables();
}

/**
 * Create necessary database tables
 */
async function createTables() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS search_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content TEXT,
      category VARCHAR(100),
      context TEXT,
      relevance_score DECIMAL(3, 2) DEFAULT 0.5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_search_items_title ON search_items(title);
    CREATE INDEX IF NOT EXISTS idx_search_items_category ON search_items(category);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Database tables created/verified');
    
    // Insert sample data if table is empty
    await insertSampleData();
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

/**
 * Insert sample data for testing
 */
async function insertSampleData() {
  try {
    const checkQuery = 'SELECT COUNT(*) FROM search_items';
    const result = await pool.query(checkQuery);
    
    if (parseInt(result.rows[0].count) === 0) {
      const insertQuery = `
        INSERT INTO search_items (title, description, content, category, context, relevance_score)
        VALUES
          ('Introduction to Machine Learning', 'Learn the fundamentals of machine learning algorithms and applications', 'Machine learning is a subset of artificial intelligence that enables systems to learn from data without explicit programming.', 'Technology', 'Educational content about ML', 0.85),
          ('React Best Practices', 'Best practices for building React applications', 'React is a popular JavaScript library for building user interfaces. Follow these best practices for optimal performance.', 'Technology', 'Frontend development guide', 0.80),
          ('Database Design Principles', 'Essential principles for designing efficient databases', 'Good database design is crucial for application performance and data integrity.', 'Technology', 'Backend development guide', 0.75),
          ('Vector Database Overview', 'Understanding vector databases and their use cases', 'Vector databases are specialized databases designed to store and query high-dimensional vectors efficiently.', 'Technology', 'Database technology guide', 0.90),
          ('API Development Guide', 'Comprehensive guide to RESTful API development', 'RESTful APIs follow specific architectural principles for building scalable web services.', 'Technology', 'Backend development guide', 0.70)
        ON CONFLICT DO NOTHING;
      `;
      
      await pool.query(insertQuery);
      console.log('Sample data inserted');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
    // Don't throw - sample data is optional
  }
}

/**
 * Search data from database based on enriched prompt
 */
async function searchData(enrichedPrompt) {
  if (!pool) {
    throw new Error('Database not initialized');
  }

  try {
    // Extract keywords from prompt (simple approach)
    const keywords = enrichedPrompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 5);

    if (keywords.length === 0) {
      return [];
    }

    // Build search query
    const searchTerms = keywords.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
      SELECT 
        id,
        title,
        description,
        content,
        category,
        context,
        relevance_score,
        created_at,
        CASE
          WHEN LOWER(title) LIKE ANY(ARRAY[${searchTerms}]) THEN 0.9
          WHEN LOWER(description) LIKE ANY(ARRAY[${searchTerms}]) THEN 0.7
          WHEN LOWER(content) LIKE ANY(ARRAY[${searchTerms}]) THEN 0.5
          ELSE 0.3
        END as match_score
      FROM search_items
      WHERE 
        LOWER(title) LIKE ANY(ARRAY[${searchTerms}])
        OR LOWER(description) LIKE ANY(ARRAY[${searchTerms}])
        OR LOWER(content) LIKE ANY(ARRAY[${searchTerms}])
      ORDER BY match_score DESC, relevance_score DESC
      LIMIT 10
    `;

    const likePatterns = keywords.map(keyword => `%${keyword}%`);
    const result = await pool.query(query, likePatterns);
    
    // Update relevance scores based on match
    return result.rows.map(row => ({
      ...row,
      relevance_score: parseFloat(row.match_score) || parseFloat(row.relevance_score)
    }));
  } catch (error) {
    console.error('Error searching database:', error);
    return [];
  }
}

/**
 * Check database connection
 */
async function checkConnection() {
  if (!pool) {
    return false;
  }

  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Close database connection pool
 */
async function close() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  initialize,
  searchData,
  checkConnection,
  close
};

