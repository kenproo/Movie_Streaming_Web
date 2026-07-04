package com.truong2k4.movie_service.modules.rating.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.rating.dto.request.RatingRequest;
import com.truong2k4.movie_service.modules.rating.dto.response.MovieRatingStatsResponse;
import com.truong2k4.movie_service.modules.rating.dto.response.RatingResponse;
import com.truong2k4.movie_service.modules.rating.entity.MovieRating;
import com.truong2k4.movie_service.modules.rating.mapper.RatingMapper;
import com.truong2k4.movie_service.modules.rating.repository.MovieRatingRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingService {

    MovieRatingRepository ratingRepository;
    UserRepository userRepository;
    RatingMapper ratingMapper;

    @Transactional
    public RatingResponse upsertRating(RatingRequest request) {
        User user = getCurrentUser();
        Optional<MovieRating> existing = ratingRepository.findByUserIdAndMovieId(user.getId(), request.getMovieId());

        MovieRating rating;
        if (existing.isPresent()) {
            rating = existing.get();
            rating.setScore(request.getScore());
            rating.setReview(request.getReview());
        } else {
            rating = MovieRating.builder()
                    .userId(user.getId())
                    .movieId(request.getMovieId())
                    .score(request.getScore())
                    .review(request.getReview())
                    .status("visible")
                    .build();
        }
        return ratingMapper.toResponse(ratingRepository.save(rating));
    }

    public List<RatingResponse> getMovieRatings(UUID movieId) {
        return ratingRepository.findByMovieIdOrderByCreatedAtDesc(movieId)
                .stream().map(ratingMapper::toResponse).collect(Collectors.toList());
    }

    public MovieRatingStatsResponse getMovieStats(UUID movieId) {
        List<MovieRating> ratings = ratingRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
        double avg = ratings.stream().mapToInt(MovieRating::getScore).average().orElse(0.0);
        return MovieRatingStatsResponse.builder()
                .averageScore(Math.round(avg * 10.0) / 10.0)
                .totalRatings(ratings.size())
                .build();
    }

    public Optional<RatingResponse> getMyRating(UUID movieId) {
        User user = getCurrentUser();
        return ratingRepository.findByUserIdAndMovieId(user.getId(), movieId)
                .map(ratingMapper::toResponse);
    }

    private User getCurrentUser() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
