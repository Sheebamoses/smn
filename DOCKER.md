# Docker Setup Guide

This application is fully containerized using Docker and Docker Compose. All services run in isolated containers with proper networking and data persistence.

## Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

## Quick Start

1. **Clone and navigate to the project directory**
   ```bash
   cd smn
   ```

2. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the frontend and backend images
   - Start PostgreSQL database
   - Start Qdrant vector database
   - Start backend API server
   - Start frontend web server

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432
   - Qdrant: http://localhost:6333

## Services

### Frontend
- **Container**: `prompt_enrichment_frontend`
- **Port**: 3000 (mapped to nginx port 80)
- **Technology**: React app served by nginx
- **Health Check**: Available at http://localhost:3000

### Backend
- **Container**: `prompt_enrichment_backend`
- **Port**: 3001
- **Technology**: Node.js/Express
- **Health Check**: Available at http://localhost:3001/api/health

### PostgreSQL
- **Container**: `prompt_enrichment_db`
- **Port**: 5432
- **Database**: `prompt_enrichment`
- **User**: `postgres`
- **Password**: `postgres` (change in production!)

### Qdrant Vector DB
- **Container**: `prompt_enrichment_qdrant`
- **Ports**: 6333 (HTTP API), 6334 (gRPC)
- **Web UI**: http://localhost:6333/dashboard

## Docker Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (clears database data)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f qdrant
```

### Rebuild services
```bash
# Rebuild all services
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

### Execute commands in containers
```bash
# Backend
docker-compose exec backend sh

# Database
docker-compose exec postgres psql -U postgres -d prompt_enrichment

# Frontend
docker-compose exec frontend sh
```

### Check service status
```bash
docker-compose ps
```

### View service health
```bash
docker-compose ps --format json | jq '.[] | {name: .Name, status: .State, health: .Health}'
```

## Environment Variables

Default environment variables are set in `docker-compose.yml`. To customize:

1. Create a `.env` file in the root directory:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   DB_PASSWORD=your_secure_password
   POSTGRES_USER=your_user
   DB_USER=your_user
   ```

2. Update `docker-compose.yml` to use these variables:
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
     DB_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
   ```

## Data Persistence

Volumes are created for persistent data storage:

- `postgres_data`: PostgreSQL database files
- `qdrant_data`: Qdrant vector database files

Data persists across container restarts. To completely reset:

```bash
docker-compose down -v
```

## Networking

All services communicate through a Docker bridge network (`app-network`):
- Frontend → Backend: `http://backend:3001`
- Backend → PostgreSQL: `postgres:5432`
- Backend → Qdrant: `http://qdrant:6333`

## Development vs Production

### Development
```bash
# Start in development mode with live logs
docker-compose up

# Rebuild after code changes
docker-compose up --build
```

### Production
```bash
# Start in detached mode
docker-compose up -d

# Use production-ready configurations
# - nginx for frontend serving
# - optimized Node.js production builds
# - proper health checks
# - restart policies
```

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs

# Check service status
docker-compose ps

# Verify Docker is running
docker info
```

### Database connection issues
```bash
# Verify PostgreSQL is healthy
docker-compose exec postgres pg_isready -U postgres

# Check backend logs
docker-compose logs backend

# Test connection manually
docker-compose exec backend node -e "require('./services/database').checkConnection().then(console.log)"
```

### Vector DB connection issues
```bash
# Verify Qdrant is healthy
curl http://localhost:6333/health

# Check Qdrant logs
docker-compose logs qdrant
```

### Frontend not loading
```bash
# Check nginx logs
docker-compose logs frontend

# Verify nginx configuration
docker-compose exec frontend nginx -t

# Test backend connectivity from frontend
docker-compose exec frontend wget -O- http://backend:3001/api/health
```

### Port conflicts
If ports are already in use, modify ports in `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Change 3000 to another port
```

### Reset everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Remove all images (optional)
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## Building Individual Images

### Backend only
```bash
cd backend
docker build -t prompt-enrichment-backend .
```

### Frontend only
```bash
cd frontend
docker build -t prompt-enrichment-frontend .
```

## Production Deployment

For production deployment:

1. **Update passwords** in `docker-compose.yml` or use secrets
2. **Configure environment variables** properly
3. **Set up reverse proxy** (nginx/traefik) for SSL termination
4. **Enable resource limits** in docker-compose.yml
5. **Set up monitoring** and logging
6. **Configure backups** for PostgreSQL and Qdrant volumes

Example resource limits:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

