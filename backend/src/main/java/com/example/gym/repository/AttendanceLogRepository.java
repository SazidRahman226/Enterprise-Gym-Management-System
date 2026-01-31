package com.example.gym.repository;

import com.example.gym.model.AttendanceLogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AttendanceLogRepository extends JpaRepository<AttendanceLogModel, Long> {
    List<AttendanceLogModel> findByMemberMemberId(Long memberId);

    // Find check-ins for today
    @Query("SELECT a FROM AttendanceLogModel a WHERE a.checkInTime BETWEEN :startOfDay AND :endOfDay")
    List<AttendanceLogModel> findTodaysCheckIns(@Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);

    // Find latest open check-in
    @Query("SELECT a FROM AttendanceLogModel a WHERE a.member.memberId = :memberId AND a.checkOutTime IS NULL ORDER BY a.checkInTime DESC")
    List<AttendanceLogModel> findActiveCheckIns(@Param("memberId") java.util.UUID memberId);
}
