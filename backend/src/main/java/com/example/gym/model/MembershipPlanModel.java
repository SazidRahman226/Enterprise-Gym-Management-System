package com.example.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "membership_plans")

public class MembershipPlanModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @Column(nullable = false)
    private String name; // Gold, Silver, Platinum

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(name = "base_fee", nullable = false)
    private BigDecimal baseFee;

    @Column(name = "access_level")
    private String accessLevel;
}
