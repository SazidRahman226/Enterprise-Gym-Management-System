package com.example.gym.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "staff")
public class StaffModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID staffId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false,  unique = true)
    private String email;

    @Column(nullable = false)
    private String role; // Admin, FrontDesk, Manager

    private BigDecimal salary;

    private String shiftDetails;

    @OneToOne(mappedBy = "staff", cascade = CascadeType.ALL)
    private TrainerModel trainerProfile;
}
