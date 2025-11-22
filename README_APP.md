# Prompt Enrichment Application

A single-page React application with a Node.js backend that enriches user prompts with context from a Vector Database and fetches results from a PostgreSQL database.

## Architecture

- **Frontend**: React SPA with modern UI
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL for structured data storage
- **Vector DB**: Qdrant for semantic search and context enrichment

## Features

- User prompt input with enrichment
- Context enrichment using Vector DB similarity search
- Database search with relevance scoring
- Results displayed as list items with star ratings
- Modern, responsive UI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Qdrant Vector DB (v1.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

#### PostgreSQL
```bash
# Create database
createdb prompt_enrichment

# Or using psql
psql -U postgres
CREATE DATABASE prompt_enrichment;
```

#### Qdrant Vector DB
```bash
# Using Docker (recommended)
docker run -p 6333:6333 qdrant/qdrant

# Or download from https://qdrant.tech/documentation/guides/installation/
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=prompt_enrichment
# DB_USER=postgres
# DB_PASSWORD=your_password
# QDRANT_URL=http://localhost:6333

# Start backend server
npm start

# Or for development with auto-reload
npm run dev
```

The backend will:
- Create necessary database tables
- Insert sample data
- Initialize Vector DB collection
- Start server on http://localhost:3001

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start React development server
npm start
```

The frontend will start on http://localhost:3000

## API Endpoints

### POST /api/enrich
Enrich a prompt and fetch results

**Request:**
```json
{
  "prompt": "machine learning"
}
```

**Response:**
```json
{
  "success": true,
  "originalPrompt": "machine learning",
  "enrichedPrompt": "machine learning [Context: ...]",
  "results": [
    {
      "title": "Machine Learning Fundamentals",
      "description": "Comprehensive guide...",
      "context": "Educational content...",
      "rating": 4.5,
      "metadata": {
        "source": "vector_db",
        "score": "0.892"
      }
    }
  ]
}
```

### GET /api/health
Check service health and database connections

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "vectorDb": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptForm.js
│   │   │   ├── ResultsList.js
│   │   │   └── ResultItem.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── enrich.js
│   ├── services/
│   │   ├── database.js
│   │   ├── vectorDb.js
│   │   └── enrichService.js
│   ├── server.js
│   └── package.json
└── README_APP.md
```

## How It Works

1. **User Input**: User enters a prompt in the React frontend
2. **Enrichment**: Backend enriches the prompt with context from Vector DB
3. **Vector Search**: Similar content is retrieved from Vector DB
4. **Database Search**: Enriched prompt is used to search PostgreSQL database
5. **Result Combination**: Results from both sources are combined and rated
6. **Display**: Results are displayed as list items with star ratings

## Production Considerations

- Replace mock vector generation with actual embedding models (e.g., OpenAI embeddings, sentence-transformers)
- Add authentication and authorization
- Implement rate limiting
- Add error handling and logging
- Set up proper environment variable management
- Add database connection pooling optimization
- Implement caching for frequently accessed data
- Add monitoring and analytics

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -l`

### Vector DB Connection Issues
- Verify Qdrant is running: `curl http://localhost:6333/health`
- Check QDRANT_URL in `.env` file
- Ensure Qdrant is accessible from backend

### Frontend Not Connecting to Backend
- Verify backend is running on port 3001
- Check proxy setting in `frontend/package.json`
- Verify CORS is enabled in backend

## License

This project is part of a coding exercise.

