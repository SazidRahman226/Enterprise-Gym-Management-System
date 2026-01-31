package com.example.gym.service;

import com.example.gym.model.MemberModel;
import com.example.gym.model.TrainerModel;
import com.example.gym.model.ClassScheduleModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.TrainerRepository;
import com.example.gym.repository.ClassScheduleRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final ClassScheduleRepository classScheduleRepository; // Needed to count classes?
    // Note: ClassScheduleRepository methods might need update or we filter in
    // memory if volume low.
    // Ideally adding "countByTrainerId" to repository is better.

    private final ValidationUtil validationUtil;

    // 1. Churn Risk: Active members who haven't checked int in last 30 days
    public List<Map<String, Object>> getChurnRiskMembers(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        List<MemberModel> atRisk = memberRepository.findChurnRiskMembers(cutoff);

        return atRisk.stream().map(m -> Map.<String, Object>of(
                "memberId", m.getMemberId(),
                "firstName", m.getFirstName(),
                "lastName", m.getLastName(),
                "email", m.getEmail(),
                "daysSinceLastVisit", "30+" // Simplified, precise calc would require fetching last log
        )).collect(Collectors.toList());
    }

    // 2. Trainer Performance
    public List<Map<String, Object>> getTrainerPerformance(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);
        List<TrainerModel> trainers = trainerRepository.findByStatus("hired");

        return trainers.stream().map(t -> {
            // Very naive implementation: Counting ALL schedules for them. Use ranges in
            // real app.
            // Using repository method if available, or just size of list if Lazy Loaded and
            // Transactional.
            // Safe bet: findByTrainerId in Repo.
            List<ClassScheduleModel> classes = classScheduleRepository.findByTrainerTrainerId(t.getTrainerId());
            int classCount = classes.size();

            BigDecimal commissionRate = t.getCommissionRate() != null ? t.getCommissionRate() : BigDecimal.ZERO;
            // Assuming base rate per class or just simple score.
            // Let's call it "Potential Commission Score" = Classes * Rate
            BigDecimal score = commissionRate.multiply(BigDecimal.valueOf(classCount));

            return Map.<String, Object>of(
                    "trainerName", t.getStaff().getFirstName() + " " + t.getStaff().getLastName(),
                    "classesAssigned", classCount,
                    "commissionRate", commissionRate,
                    "performanceScore", score);
        }).collect(Collectors.toList());
    }
}
