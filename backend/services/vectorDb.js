const { QdrantClient } = require('@qdrant/js-client-rest');

let client = null;
const COLLECTION_NAME = 'prompt_context';

/**
 * Initialize Qdrant Vector DB connection
 */
function initialize() {
  if (client) {
    return Promise.resolve();
  }

  const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
  const qdrantApiKey = process.env.QDRANT_API_KEY || null;

  client = new QdrantClient({
    url: qdrantUrl,
    apiKey: qdrantApiKey,
  });

  // Create collection if it doesn't exist
  return createCollection();
}

/**
 * Create collection in Qdrant if it doesn't exist
 */
async function createCollection() {
  try {
    // Check if collection exists
    const collections = await client.getCollections();
    const collectionExists = collections.collections.some(
      col => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      // Create collection with 384 dimensions (sentence-transformers/all-MiniLM-L6-v2)
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384,
          distance: 'Cosine',
        },
      });
      console.log(`Vector DB collection '${COLLECTION_NAME}' created`);
      
      // Insert sample data
      await insertSampleVectors();
    } else {
      console.log(`Vector DB collection '${COLLECTION_NAME}' already exists`);
    }
  } catch (error) {
    console.error('Error creating Vector DB collection:', error);
    // Don't throw - Vector DB might not be available
  }
}

/**
 * Insert sample vectors for testing
 * Note: In production, you would use a proper embedding model
 */
async function insertSampleVectors() {
  try {
    // Sample data with mock vectors (in production, use actual embeddings)
    const sampleData = [
      {
        id: 1,
        vector: generateMockVector(384),
        payload: {
          title: 'Machine Learning Fundamentals',
          description: 'Comprehensive guide to machine learning concepts and algorithms',
          text: 'Machine learning enables computers to learn from data without being explicitly programmed.',
          context: 'Educational content about artificial intelligence',
        },
      },
      {
        id: 2,
        vector: generateMockVector(384),
        payload: {
          title: 'React Development Guide',
          description: 'Best practices for building modern React applications',
          text: 'React is a powerful library for building user interfaces with component-based architecture.',
          context: 'Frontend development tutorial',
        },
      },
      {
        id: 3,
        vector: generateMockVector(384),
        payload: {
          title: 'Vector Database Technology',
          description: 'Understanding vector databases for similarity search',
          text: 'Vector databases store high-dimensional vectors and enable efficient similarity search operations.',
          context: 'Database technology overview',
        },
      },
      {
        id: 4,
        vector: generateMockVector(384),
        payload: {
          title: 'RESTful API Design',
          description: 'Principles of designing RESTful web services',
          text: 'RESTful APIs follow stateless architecture principles for scalable web services.',
          context: 'Backend development guide',
        },
      },
      {
        id: 5,
        vector: generateMockVector(384),
        payload: {
          title: 'Database Optimization',
          description: 'Techniques for optimizing database performance',
          text: 'Database optimization involves indexing, query tuning, and proper schema design.',
          context: 'Database administration guide',
        },
      },
    ];

    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points: sampleData,
    });

    console.log('Sample vectors inserted into Vector DB');
  } catch (error) {
    console.error('Error inserting sample vectors:', error);
    // Don't throw - sample data is optional
  }
}

/**
 * Generate a mock vector for testing
 * In production, replace this with actual embeddings from a model
 */
function generateMockVector(dimensions) {
  return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
}

/**
 * Search for similar vectors in the collection
 * Note: In production, you should generate embeddings for the query
 */
async function search(query, limit = 5) {
  if (!client) {
    throw new Error('Vector DB not initialized');
  }

  try {
    // Generate mock query vector (in production, use actual embedding model)
    const queryVector = generateMockVector(384);

    const searchResult = await client.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: limit,
      with_payload: true,
    });

    return searchResult;
  } catch (error) {
    console.error('Error searching Vector DB:', error);
    // Return empty array if search fails
    return [];
  }
}

/**
 * Add a new vector to the collection
 */
async function addVector(id, vector, payload) {
  if (!client) {
    throw new Error('Vector DB not initialized');
  }

  try {
    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: id,
          vector: vector,
          payload: payload,
        },
      ],
    });
  } catch (error) {
    console.error('Error adding vector:', error);
    throw error;
  }
}

/**
 * Check Vector DB connection
 */
async function checkConnection() {
  if (!client) {
    return false;
  }

  try {
    await client.getCollections();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  initialize,
  search,
  addVector,
  checkConnection,
};

