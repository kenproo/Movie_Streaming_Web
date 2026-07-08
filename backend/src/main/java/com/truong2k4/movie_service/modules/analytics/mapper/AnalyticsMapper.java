package com.truong2k4.movie_service.modules.analytics.mapper;

import com.truong2k4.movie_service.modules.analytics.dto.response.AccessLogResponse;
import com.truong2k4.movie_service.modules.analytics.dto.response.DailyTrafficResponse;
import com.truong2k4.movie_service.modules.analytics.entity.AccessLog;
import com.truong2k4.movie_service.modules.analytics.entity.DailyTraffic;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsMapper {

    public DailyTrafficResponse toDailyTrafficResponse(DailyTraffic traffic) {
        if (traffic == null) return null;
        return DailyTrafficResponse.builder()
                .id(traffic.getId())
                .date(traffic.getDate())
                .visits(traffic.getVisits())
                .views(traffic.getViews())
                .build();
    }

    public AccessLogResponse toAccessLogResponse(AccessLog logItem) {
        if (logItem == null) return null;
        return AccessLogResponse.builder()
                .id(logItem.getId())
                .userId(logItem.getUserId())
                .movieId(logItem.getMovieId())
                .page(logItem.getPage())
                .action(logItem.getAction())
                .keyword(logItem.getKeyword())
                .createdAt(logItem.getCreatedAt())
                .build();
    }
}
