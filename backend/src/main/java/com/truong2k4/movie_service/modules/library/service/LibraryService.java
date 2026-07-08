package com.truong2k4.movie_service.modules.library.service;

import com.truong2k4.movie_service.common.exception.AppException;
import com.truong2k4.movie_service.common.exception.ErrorCode;
import com.truong2k4.movie_service.modules.library.dto.LibraryResponse;
import com.truong2k4.movie_service.modules.library.entity.Favorite;
import com.truong2k4.movie_service.modules.library.entity.Follow;
import com.truong2k4.movie_service.modules.library.entity.WatchHistory;
import com.truong2k4.movie_service.modules.library.repository.FavoriteRepository;
import com.truong2k4.movie_service.modules.library.repository.FollowRepository;
import com.truong2k4.movie_service.modules.library.repository.WatchHistoryRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LibraryService {

    FavoriteRepository favoriteRepository;
    FollowRepository followRepository;
    WatchHistoryRepository watchHistoryRepository;
    UserRepository userRepository;
    com.truong2k4.movie_service.modules.movie.repository.MovieRepository movieRepository;
    com.truong2k4.movie_service.modules.movie.mapper.MovieMapper movieMapper;

    public List<com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse> getFavoriteMoviesDetails() {
        User currentUser = getCurrentUser();
        List<UUID> movieIds = favoriteRepository.findAllByUserId(currentUser.getId()).stream()
                .map(Favorite::getMovieId)
                .collect(Collectors.toList());
        if (movieIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return movieRepository.findAllById(movieIds).stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    public List<com.truong2k4.movie_service.modules.movie.dto.response.MovieSummaryResponse> getFollowMoviesDetails() {
        User currentUser = getCurrentUser();
        List<UUID> movieIds = followRepository.findAllByUserId(currentUser.getId()).stream()
                .map(Follow::getMovieId)
                .collect(Collectors.toList());
        if (movieIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return movieRepository.findAllById(movieIds).stream()
                .map(movieMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }

    public LibraryResponse getLibrary() {
        User currentUser = getCurrentUser();
        UUID userId = currentUser.getId();

        List<String> favorites = favoriteRepository.findAllByUserId(userId).stream()
                .map(fav -> fav.getMovieId().toString())
                .collect(Collectors.toList());

        List<String> follows = followRepository.findAllByUserId(userId).stream()
                .map(fol -> fol.getMovieId().toString())
                .collect(Collectors.toList());

        List<LibraryResponse.WatchHistoryItem> history = watchHistoryRepository.findAllByUserIdOrderByWatchedAtDesc(userId).stream()
                .map(wh -> LibraryResponse.WatchHistoryItem.builder()
                        .movieId(wh.getMovieId().toString())
                        .episodeNumber(wh.getEpisodeNumber())
                        .watchedAt(wh.getWatchedAt())
                        .build())
                .collect(Collectors.toList());

        return LibraryResponse.builder()
                .favorites(favorites)
                .follows(follows)
                .history(history)
                .build();
    }

    public boolean isFavorite(UUID movieId) {
        User currentUser = getCurrentUser();
        return favoriteRepository.existsByUserIdAndMovieId(currentUser.getId(), movieId);
    }

    public boolean isFollowing(UUID movieId) {
        User currentUser = getCurrentUser();
        return followRepository.existsByUserIdAndMovieId(currentUser.getId(), movieId);
    }

    @Transactional
    public void toggleFavorite(UUID movieId) {
        User currentUser = getCurrentUser();
        UUID userId = currentUser.getId();

        Optional<Favorite> existing = favoriteRepository.findByUserIdAndMovieId(userId, movieId);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
        } else {
            Favorite favorite = Favorite.builder()
                    .userId(userId)
                    .movieId(movieId)
                    .createdAt(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void toggleFollow(UUID movieId) {
        User currentUser = getCurrentUser();
        UUID userId = currentUser.getId();

        Optional<Follow> existing = followRepository.findByUserIdAndMovieId(userId, movieId);
        if (existing.isPresent()) {
            followRepository.delete(existing.get());
        } else {
            Follow follow = Follow.builder()
                    .userId(userId)
                    .movieId(movieId)
                    .createdAt(LocalDateTime.now())
                    .build();
            followRepository.save(follow);
        }
    }

    @Transactional
    public void addHistory(UUID movieId, int episodeNumber) {
        User currentUser = getCurrentUser();
        UUID userId = currentUser.getId();

        // Update if existing for the same movie and episode
        Optional<WatchHistory> existing = watchHistoryRepository.findByUserIdAndMovieIdAndEpisodeNumber(userId, movieId, episodeNumber);
        if (existing.isPresent()) {
            WatchHistory history = existing.get();
            history.setWatchedAt(LocalDateTime.now());
            watchHistoryRepository.save(history);
        } else {
            WatchHistory history = WatchHistory.builder()
                    .userId(userId)
                    .movieId(movieId)
                    .episodeNumber(episodeNumber)
                    .watchedAt(LocalDateTime.now())
                    .build();
            watchHistoryRepository.save(history);
        }
    }

    private User getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName(); // username/email
        return userRepository.findByUsername(name)
                .or(() -> userRepository.findByEmail(name))
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
    }
}
