package com.example.gym.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class InvoiceModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID invoiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_id", nullable = false)
    private SubscriptionModel subscription;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private String status; // paid, unpaid, overdue

    @OneToOne(mappedBy = "invoice", cascade = CascadeType.ALL)
    private PaymentModel payments;

}
