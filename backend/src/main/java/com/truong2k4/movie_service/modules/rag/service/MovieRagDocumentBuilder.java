package com.truong2k4.movie_service.modules.rag.service;

import com.truong2k4.movie_service.modules.movie.entity.Movie;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
public class MovieRagDocumentBuilder {

    public String buildMovieMetadataDocument(Movie movie) {
        StringJoiner joiner = new StringJoiner("\n");

        joiner.add("Tên phim: " + safe(movie.getTitle()));
        joiner.add("Tên gốc: " + safe(movie.getOriginalTitle()));
        joiner.add("Năm phát hành: " + movie.getYear());
        joiner.add("Quốc gia: " + safe(movie.getCountry()));
        joiner.add("Loại phim: " + (movie.getType() != null ? movie.getType().name() : ""));
        joiner.add("Thể loại: " + (movie.getGenres() != null ? String.join(", ", movie.getGenres()) : ""));
        joiner.add("Diễn viên: " + (movie.getCast() != null ? String.join(", ", movie.getCast()) : ""));
        joiner.add("Đạo diễn: " + safe(movie.getDirector()));
        joiner.add("Từ khóa: " + (movie.getKeywords() != null ? String.join(", ", movie.getKeywords()) : ""));
        joiner.add("Tags: " + (movie.getTags() != null ? String.join(", ", movie.getTags()) : ""));
        joiner.add("Rating: " + movie.getRating());
        joiner.add("Thời lượng: " + safe(movie.getDuration()));
        joiner.add("Số tập: " + movie.getTotalEpisodes());
        joiner.add("Tập hiện tại: " + movie.getCurrentEpisode());
        joiner.add("Trạng thái phát hành: " + (movie.getReleaseStatus() != null ? movie.getReleaseStatus().name() : ""));
        joiner.add("Ngôn ngữ: " + safe(movie.getLanguage()));
        joiner.add("Mô tả nội dung: " + safe(movie.getDescription()));

        return joiner.toString();
    }

    private String safe(Object value) {
        return value == null ? "" : value.toString();
    }
}
