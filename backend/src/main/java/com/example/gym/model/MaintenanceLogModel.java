package com.example.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "maintenance_logs")
public class MaintenanceLogModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maint_id")
    private Long maintId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equip_id", nullable = false)
    private EquipmentModel equipment;

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    private BigDecimal cost;

    private String description;

    @Column(name = "technician_name")
    private String technicianName;
}
