package com.truong2k4.movie_service.importer.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieImportDto {
    @JsonAlias({"id", "movie_id", "movieId"})
    private UUID id;

    @JsonAlias({"slug"})
    private String slug;

    @JsonAlias({"title"})
    private String title;

    @JsonAlias({"originalTitle", "original_title"})
    private String originalTitle;

    @JsonAlias({"description", "overview"})
    private String description;

    @JsonAlias({"year"})
    private Integer year;

    @JsonAlias({"releaseDate", "release_date"})
    private String releaseDate;

    @JsonAlias({"country", "productionCountries", "production_countries"})
    private String country;

    @JsonAlias({"type"})
    private String type;

    @JsonAlias({"quality"})
    private String quality;

    @JsonAlias({"language"})
    private String language;

    @JsonAlias({"rating", "voteAverage", "vote_average"})
    private Double rating;

    @JsonAlias({"duration", "runtime"})
    private String duration;

    @JsonAlias({"totalEpisodes"})
    private Integer totalEpisodes;

    @JsonAlias({"currentEpisode"})
    private Integer currentEpisode;

    @JsonAlias({"releaseStatus"})
    private String releaseStatus;

    @JsonAlias({"status"})
    private String status;

    @JsonAlias({"views"})
    private Long views;

    @JsonAlias({"posterUrl", "poster_url", "posterPath", "poster_path"})
    private String posterUrl;

    @JsonAlias({"posterFileName", "poster_file_name"})
    private String posterFileName;

    @JsonAlias({"backdropUrl"})
    private String backdropUrl;

    @JsonAlias({"trailerUrl"})
    private String trailerUrl;

    @JsonAlias({"tmdbId", "tmdb_id", "Id"})
    private String tmdbId;

    @JsonAlias({"imdbId", "imdb_id"})
    private String imdbId;

    @JsonAlias({"director", "Director"})
    private String director;

    @JsonAlias({"writer"})
    private String writer;

    @JsonAlias({"studio", "productionCompanies", "production_companies"})
    private String studio;

    @JsonAlias({"ageRating"})
    private String ageRating;

    @JsonAlias({"popularity"})
    private Double popularity;

    @JsonAlias({"keywords"})
    private Object keywords;

    @JsonAlias({"tags"})
    private Object tags;

    @JsonAlias({"genres"})
    private Object genres;

    @JsonAlias({"cast", "stars"})
    private Object cast;
}
