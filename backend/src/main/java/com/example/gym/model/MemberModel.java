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
@Table(name = "members", indexes = {
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

    private String emergencyContact;

    @Column(nullable = false)
    private LocalDate dob;

    private String currentStatus; // Active, Expired, Banned, Pending

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubscriptionModel> subscriptions;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<ClassBookingModel> bookings;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY)
    private List<AttendanceLogModel> attendanceLogs;
}
