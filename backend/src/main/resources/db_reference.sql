-- Database Migration Reference for Movie Video Sources
-- This script matches the Movie UUID primary key mapping (VARCHAR(36)).

CREATE TABLE movie_video_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    movie_id VARCHAR(36) NOT NULL,
    type VARCHAR(30) NOT NULL,
    provider VARCHAR(30) NOT NULL,
    video_url TEXT,
    embed_url TEXT,
    storage_key VARCHAR(500),
    quality VARCHAR(20),
    duration_seconds INT,
    license_type VARCHAR(50),
    attribution TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movie_video_sources_movie
        FOREIGN KEY (movie_id) REFERENCES movies(id)
);
