package com.example.gym.repository;

import com.example.gym.model.ClassBookingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBookingModel, Long> {
    List<ClassBookingModel> findByMemberMemberId(java.util.UUID memberId);

    boolean existsByMemberMemberIdAndClassScheduleScheduleId(java.util.UUID memberId, Long scheduleId);

    // Count confirmed bookings for a specific class (for capacity check)
    Long countByClassScheduleScheduleIdAndStatus(Long scheduleId, String status);
}
