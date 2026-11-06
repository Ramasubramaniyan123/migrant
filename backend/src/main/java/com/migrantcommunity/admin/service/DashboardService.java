package com.migrantcommunity.admin.service;

import com.migrantcommunity.admin.dto.*;
import com.migrantcommunity.moderation.dto.Report;
import com.migrantcommunity.common.enums.ReportCategory;
import com.migrantcommunity.common.enums.ReportStatus;
import com.migrantcommunity.common.enums.ReportTargetType;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    public DashboardStatistics getStatistics() {
        return new DashboardStatistics(4745, 1820, 38, 107, 68, 64, 5600, 12, 8, 1198, 12400);
    }

    public DashboardOverview getOverview() {
        List<TimeSeriesPoint> growth = new ArrayList<>();
        String[] days = {"Mon","Tue","Wed","Thu","Fri","Sat","Sun"};
        for (int i = 0; i < days.length; i++) {
            growth.add(new TimeSeriesPoint(days[i], 4600 + i * 20, 1700 + i * 15, 1100 + i * 10, 5500 + i * 25));
        }
        List<LanguageDistribution> langs = List.of(
                new LanguageDistribution("Hindi", 1820, 38.4),
                new LanguageDistribution("Tamil", 620, 13.1),
                new LanguageDistribution("Telugu", 540, 11.4),
                new LanguageDistribution("Bengali", 480, 10.1),
                new LanguageDistribution("Marathi", 420, 8.9),
                new LanguageDistribution("Others", 865, 18.1)
        );
        List<CityDistribution> cities = List.of(
                new CityDistribution("Mumbai", 1520, 32.0),
                new CityDistribution("Delhi", 980, 20.7),
                new CityDistribution("Bengaluru", 760, 16.0),
                new CityDistribution("Pune", 540, 11.4),
                new CityDistribution("Chennai", 480, 10.1),
                new CityDistribution("Others", 465, 9.8)
        );
        List<ActivityItem> activity = List.of(
                new ActivityItem("act_1", "USER_JOINED", "New user registered", "Aarav Sharma", "2025-01-01T10:00:00Z"),
                new ActivityItem("act_2", "COMMUNITY_CREATED", "New community created", "Priya Nair", "2025-01-01T09:30:00Z"),
                new ActivityItem("act_3", "POST_CREATED", "New post in Mumbai Migrants", "Rahul Verma", "2025-01-01T09:00:00Z"),
                new ActivityItem("act_4", "REPORT_FILED", "Content reported", "System", "2025-01-01T08:30:00Z"),
                new ActivityItem("act_5", "ADMIN_ACTION", "User suspended", "Moderator", "2025-01-01T08:00:00Z")
        );
        List<Report> pending = List.of(
                new Report("rep_1", ReportTargetType.POST, "post_1", "Offensive language in post", "usr_10", "Ravi Kumar", ReportCategory.HATE_SPEECH, "Contains hate speech", ReportStatus.PENDING, "HIGH", null, "2025-01-01T07:00:00Z", null, null),
                new Report("rep_2", ReportTargetType.USER, "usr_20", "Fake profile suspected", "usr_11", "Anita Das", ReportCategory.FAKE_PROFILE, "Profile looks fake", ReportStatus.UNDER_REVIEW, "MEDIUM", "adm_003", "2025-01-01T06:00:00Z", null, null)
        );
        return new DashboardOverview(getStatistics(), growth, langs, cities, activity, pending);
    }
}
