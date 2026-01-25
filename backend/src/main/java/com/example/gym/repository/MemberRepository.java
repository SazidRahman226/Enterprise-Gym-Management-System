package com.example.gym.repository;

import com.example.gym.model.MemberModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberModel, Long> {
    Optional<MemberModel> findByEmail(String email);

    List<MemberModel> findByCurrentStatus(String status);

    // For "Churn Risk": Find active members with no attendance in X days
    @Query("SELECT m FROM MemberModel m " +
            "WHERE m.currentStatus = 'Active' " +
            "AND m.memberId NOT IN " +
            "(SELECT a.member.memberId FROM AttendanceLogModel a WHERE a.checkInTime > :cutoffDate)")
    List<MemberModel> findChurnRiskMembers(@Param("cutoffDate") LocalDateTime cutoffDate);
}
