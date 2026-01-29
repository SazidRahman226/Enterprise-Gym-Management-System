package com.example.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity

public class MembershipPlanModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID planId;

    @Column(nullable = false)
    private String name; // gold, silver, platinum

    @Column(nullable = false)
    private Integer durationDays;

    @Column(nullable = false)
    private BigDecimal baseFee;

    private BigDecimal discountedFee;

}
