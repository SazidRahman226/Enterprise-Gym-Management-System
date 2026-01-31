package com.example.gym.dto;

import lombok.Data;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class ClassScheduleRequest {
    private UUID trainerId;
    private Long roomId;
    private String className;
    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
