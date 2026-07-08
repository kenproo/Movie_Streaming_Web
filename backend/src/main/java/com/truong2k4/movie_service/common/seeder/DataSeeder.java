package com.truong2k4.movie_service.common.seeder;

import com.truong2k4.movie_service.modules.analytics.entity.DailyTraffic;
import com.truong2k4.movie_service.modules.analytics.entity.MovieAnalytics;
import com.truong2k4.movie_service.modules.analytics.repository.DailyTrafficRepository;
import com.truong2k4.movie_service.modules.analytics.repository.MovieAnalyticsRepository;
import com.truong2k4.movie_service.modules.comment.entity.Comment;
import com.truong2k4.movie_service.modules.comment.repository.CommentRepository;
import com.truong2k4.movie_service.modules.movie.entity.*;
import com.truong2k4.movie_service.modules.movie.repository.MovieRepository;
import com.truong2k4.movie_service.modules.user.entity.User;
import com.truong2k4.movie_service.modules.user.entity.UserRole;
import com.truong2k4.movie_service.modules.user.entity.UserStatus;
import com.truong2k4.movie_service.modules.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DataSeeder implements CommandLineRunner {

    UserRepository userRepository;
    MovieRepository movieRepository;
    CommentRepository commentRepository;
    DailyTrafficRepository dailyTrafficRepository;
    MovieAnalyticsRepository movieAnalyticsRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting database seeding check...");

        if (userRepository.count() == 0) {
            log.info("Seeding users...");
            seedUsers();
        }

        // if (movieRepository.count() == 0) {
        //     log.info("Seeding movies...");
        //     seedMovies();
        // }

        if (dailyTrafficRepository.count() == 0) {
            log.info("Seeding daily traffic analytics...");
            seedDailyTraffic();
        }

        log.info("Database seeding finished.");
    }

    private void seedUsers() {
        User admin = User.builder()
                .name("ChillFilm Admin")
                .email("admin@chillfilm.com")
                .username("admin")
                .password(passwordEncoder.encode("adminpassword"))
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .avatarUrl("https://placehold.co/120x120/082f49/67e8f9?text=A")
                .createdAt(LocalDateTime.now())
                .build();

        User user = User.builder()
                .name("ChillFilm User")
                .email("user@chillfilm.com")
                .username("user")
                .password(passwordEncoder.encode("userpassword"))
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .avatarUrl("https://placehold.co/120x120/082f49/67e8f9?text=U")
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        userRepository.save(user);
    }

    private void seedMovies() {
        // Neon Harbor
        Movie m1 = createMoviePojo("Neon Harbor", "neon-harbor", MovieType.SINGLE, 2026, "Vietnam",
                List.of("hanh-dong", "tam-ly"), "4K", "Vietsub", 8.7, 1, 1,
                ReleaseStatus.COMPLETED, MovieStatus.PUBLISHED, 98210, null, "112 phút");

        // Midnight Atlas
        Movie m2 = createMoviePojo("Midnight Atlas", "midnight-atlas", MovieType.SINGLE, 2025, "Japan",
                List.of("phieu-luu", "bi-an"), "Full HD", "Vietsub", 8.1, 1, 1,
                ReleaseStatus.COMPLETED, MovieStatus.PUBLISHED, 76210, null, "112 phút");

        // City Of Glass Lines
        Movie m3 = createMoviePojo("City Of Glass Lines", "city-of-glass-lines", MovieType.SERIES, 2026, "Korea",
                List.of("tam-ly", "doi-thuong"), "Full HD", "Vietsub", 8.6, 16, 6,
                ReleaseStatus.ONGOING, MovieStatus.PUBLISHED, 198200, null, "45 phút/tập");

        // Northern Desk
        Movie m4 = createMoviePojo("Northern Desk", "northern-desk", MovieType.SERIES, 2025, "UK",
                List.of("toi-pham", "bi-an"), "4K", "Vietsub", 8.3, 8, 8,
                ReleaseStatus.COMPLETED, MovieStatus.PUBLISHED, 144000, null, "45 phút/tập");

        // Starlit Bento Club
        Movie m5 = createMoviePojo("Starlit Bento Club", "starlit-bento-club", MovieType.ANIME, 2026, "Japan",
                List.of("hoc-duong", "hai-huoc"), "Full HD", "Vietsub", 8.5, 12, 4,
                ReleaseStatus.ONGOING, MovieStatus.PUBLISHED, 122000, AnimeSeason.SPRING, "24 phút/tập");

        // Skygear Orchard
        Movie m6 = createMoviePojo("Skygear Orchard", "skygear-orchard", MovieType.ANIME, 2025, "Japan",
                List.of("phieu-luu", "vien-tuong"), "4K", "Vietsub", 8.9, 24, 24,
                ReleaseStatus.COMPLETED, MovieStatus.PUBLISHED, 234000, AnimeSeason.WINTER, "24 phút/tập");

        m1 = movieRepository.save(m1);
        m2 = movieRepository.save(m2);
        m3 = movieRepository.save(m3);
        m4 = movieRepository.save(m4);
        m5 = movieRepository.save(m5);
        m6 = movieRepository.save(m6);

        // Seed some analytics records for these movies
        createMovieAnalytics(m1.getId(), 98210, 1500, 350, 480000);
        createMovieAnalytics(m2.getId(), 76210, 1100, 240, 360000);
        createMovieAnalytics(m3.getId(), 198200, 3200, 710, 950000);
        createMovieAnalytics(m4.getId(), 144000, 2200, 520, 710000);
        createMovieAnalytics(m5.getId(), 122000, 1900, 460, 610000);
        createMovieAnalytics(m6.getId(), 234000, 4100, 980, 1200000);

        // Seed some comments for Neon Harbor
        seedCommentsForMovie(m1.getId());
    }

    private Movie createMoviePojo(String title, String slug, MovieType type, int year, String country,
                                  List<String> genres, String quality, String language, double rating,
                                  int totalEpisodes, int currentEpisode, ReleaseStatus releaseStatus,
                                  MovieStatus status, long views, AnimeSeason animeSeason, String duration) {
        
        Movie movie = Movie.builder()
                .title(title)
                .originalTitle(title + " Original")
                .slug(slug)
                .type(type)
                .year(year)
                .country(country)
                .genres(genres)
                .displayQuality(quality)
                .displayLanguage(language)
                .rating(rating)
                .totalEpisodes(totalEpisodes)
                .currentEpisode(currentEpisode)
                .releaseStatus(releaseStatus)
                .status(status)
                .views(views)
                .duration(duration)
                .posterUrl("https://placehold.co/420x630/031525/67e8f9?text=" + title.replace(" ", "+"))
                .backdropUrl("https://placehold.co/1280x720/06111f/a3e635?text=" + title.replace(" ", "+") + "+Backdrop")
                .trailerUrl("/videos/sample.mp4")
                .animeSeason(animeSeason)
                .createdAt(LocalDateTime.now().minusMonths(1))
                .updatedAt(LocalDateTime.now())
                .build();

        List<Episode> episodes = new ArrayList<>();
        for (int i = 1; i <= currentEpisode; i++) {
            Episode episode = Episode.builder()
                    .episodeNumber(i)
                    .seasonNumber(1)
                    .title("Tập " + i)
                    .movie(movie)
                    .build();

            EpisodeSource source = EpisodeSource.builder()
                    .episode(episode)
                    .serverName("Default Server")
                    .quality("1080p")
                    .videoUrl("/videos/sample.mp4")
                    .isDefault(true)
                    .isActive(true)
                    .isDemo(true)
                    .provider(VideoProvider.LOCAL)
                    .build();

            episode.setSources(new ArrayList<>(List.of(source)));
            episodes.add(episode);
        }
        movie.setEpisodes(episodes);

        return movie;
    }


    private void createMovieAnalytics(UUID movieId, int views, int likes, int comments, int watchTime) {
        MovieAnalytics analytics = MovieAnalytics.builder()
                .movieId(movieId)
                .views(views)
                .likes(likes)
                .comments(comments)
                .watchTimeMinutes(watchTime)
                .build();
        movieAnalyticsRepository.save(analytics);
    }

    private void seedCommentsForMovie(UUID movieId) {
        User user = userRepository.findByUsername("user").orElse(null);
        if (user == null) return;

        Comment c1 = Comment.builder()
                .movieId(movieId)
                .userId(user.getId())
                .userName(user.getName())
                .userAvatarUrl(user.getAvatarUrl())
                .content("Phim hay quá! Neon Harbor thực sự là một tuyệt phẩm khoa học viễn tưởng.")
                .status("visible")
                .likes(25)
                .reports(0)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();

        c1 = commentRepository.save(c1);

        Comment c2 = Comment.builder()
                .movieId(movieId)
                .parentId(c1.getId())
                .userId(user.getId()) // using same user for simplicity
                .userName("ChillFilm Admin")
                .userAvatarUrl("https://placehold.co/120x120/082f49/67e8f9?text=A")
                .content("Cảm ơn bạn đã ủng hộ ChillFilm! Tập tiếp theo sẽ được phát sóng sớm nhé.")
                .status("visible")
                .likes(5)
                .reports(0)
                .createdAt(LocalDateTime.now().minusDays(4))
                .build();

        commentRepository.save(c2);
    }

    private void seedDailyTraffic() {
        LocalDate today = LocalDate.now();
        for (int i = 14; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            DailyTraffic traffic = DailyTraffic.builder()
                    .date(date)
                    .visits(500 + new Random().nextInt(300))
                    .views(1200 + new Random().nextInt(800))
                    .build();
            dailyTrafficRepository.save(traffic);
        }
    }
}
