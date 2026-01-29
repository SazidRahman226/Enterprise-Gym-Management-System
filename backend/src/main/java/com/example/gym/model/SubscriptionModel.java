package com.example.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class SubscriptionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID subId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id" ,nullable = false)
    private MemberModel member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlanModel plan;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String status; // active, pending, canceled

    @OneToMany(cascade = CascadeType.ALL)
    private List<InvoiceModel> invoices;

    @PrePersist
    public void prePersist()
    {
        this.startDate = LocalDate.now();
        this.endDate = LocalDate.now().plusDays(this.plan.getDurationDays());
    }
}
