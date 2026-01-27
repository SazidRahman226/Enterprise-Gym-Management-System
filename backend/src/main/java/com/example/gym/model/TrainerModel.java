package com.example.gym.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "trainers")

public class TrainerModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID trainerId;

    @OneToOne
    @JoinColumn(name = "staff_id", nullable = false, unique = true)
    private StaffModel staff;

    private String specialization;

    @Column(precision = 5, scale = 2)
    private BigDecimal commissionRate;

    @OneToMany(mappedBy = "trainer")
    private List<ClassScheduleModel> schedules;
}
