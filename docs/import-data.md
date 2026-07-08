# ChillFilm Data Import Guide

This guide explains how to import Movie, Episode, EpisodeSource, Subtitle, and MovieVideoSource data into MySQL and Qdrant for the ChillFilm project.

## 1. Export Data Placement

Gather all your exported data files into a single local folder. For example:
`C:\Users\Truong\Downloads\chillfilm_local_export`

The folder should contain the following files:
- `movies_mysql.json`
- `episodes_mysql.json`
- `episode_sources_mysql.json`
- `subtitles_mysql.json`
- `movie_video_sources_mysql.json`
- `qdrant_points.jsonl`
- `qdrant_collection_config.json` (optional)

## 2. Set Environment Variables (Windows PowerShell)

Open PowerShell and set the environment variables to point to your data directory and the S3 assets location:

```powershell
$env:CHILLFILM_IMPORT_DIR="C:\Users\Truong\Downloads\chillfilm_local_export"
$env:CHILLFILM_S3_PUBLIC_BASE_URL="https://chillfilm-assets-07072026.s3.ap-southeast-1.amazonaws.com/posters"
```

## 3. Run Backend (Spring Boot)

Run the backend application with the dev/local profile active:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 4. Call Admin Import APIs

The import APIs are protected and require a user with the `ADMIN` role. Use Postman or curl to call the following endpoints:

### Dry-run Validation (No database writes)
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/admin/import/dry-run`

### Import All Data
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/admin/import/all`

### Import Components Separately
- **Movies**: `POST http://localhost:8080/api/admin/import/movies`
- **Episodes**: `POST http://localhost:8080/api/admin/import/episodes`
- **Episode Sources**: `POST http://localhost:8080/api/admin/import/episode-sources`
- **Subtitles**: `POST http://localhost:8080/api/admin/import/subtitles`
- **Movie Video Sources**: `POST http://localhost:8080/api/admin/import/movie-video-sources`

## 5. Run Qdrant Local Container

Deploy Qdrant using the provided docker compose file:

```bash
cd docker/qdrant
docker compose up -d
```

## 6. Run Qdrant Vector Import Script

Install the required library and execute the Python import script to sync vectors:

```bash
pip install qdrant-client
python scripts/qdrant/import_qdrant_points.py
```

*Note: You can pass env variables like `QDRANT_RECREATE=true` before running to delete and recreate the collection.*

## 7. Verify MySQL Database Counts

Run the following SQL queries in your database client (e.g., DBeaver or MySQL CLI) to confirm that the imports succeeded:

```sql
SELECT COUNT(*) FROM movies;
SELECT COUNT(*) FROM episodes;
SELECT COUNT(*) FROM episode_sources;
SELECT COUNT(*) FROM subtitles;
SELECT COUNT(*) FROM movie_video_sources;
```

## 8. Test Retrieve APIs

Ensure the public APIs load the imported movie entries correctly:

- **Get all movies**: `GET http://localhost:8080/api/movies`
- **Get movie details by slug**: `GET http://localhost:8080/api/movies/{slug}`
