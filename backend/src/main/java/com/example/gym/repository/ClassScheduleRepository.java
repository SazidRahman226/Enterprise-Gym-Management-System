package com.example.gym.repository;

import com.example.gym.model.ClassScheduleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassScheduleModel, Long> {
        List<ClassScheduleModel> findByTrainerTrainerId(UUID trainerId);

        // Check for room double booking
        @Query("SELECT c FROM ClassScheduleModel c " +
                        "WHERE c.room.roomId = :roomId " +
                        "AND c.dayOfWeek = :dayOfWeek " +
                        "AND ((c.startTime BETWEEN :start AND :end) OR (c.endTime BETWEEN :start AND :end))")
        List<ClassScheduleModel> findRoomConflicts(@Param("roomId") Long roomId,
                        @Param("dayOfWeek") String dayOfWeek,
                        @Param("start") LocalTime start,
                        @Param("end") LocalTime end);

        @Query("SELECT c FROM ClassScheduleModel c " +
                        "WHERE c.trainer.trainerId = :trainerId " +
                        "AND c.dayOfWeek = :dayOfWeek " +
                        "AND ((c.startTime BETWEEN :start AND :end) OR (c.endTime BETWEEN :start AND :end))")
        List<ClassScheduleModel> findTrainerConflicts(@Param("trainerId") UUID trainerId,
                        @Param("dayOfWeek") String dayOfWeek,
                        @Param("start") LocalTime start,
                        @Param("end") LocalTime end);
}