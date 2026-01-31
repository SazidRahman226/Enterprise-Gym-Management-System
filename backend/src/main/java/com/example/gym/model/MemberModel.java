package com.example.gym.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(indexes = {
        @Index(name = "idx_member_email", columnList = "email", unique = true)
})
public class MemberModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID memberId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(unique = true)
    private String emergencyContact;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String currentStatus; // active, expired, banned, pending

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SubscriptionModel subscriptions;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ClassBookingModel> bookings;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<AttendanceLogModel> attendanceLogs;
}
