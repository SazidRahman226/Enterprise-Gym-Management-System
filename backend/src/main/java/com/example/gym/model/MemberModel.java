package com.example.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "members", indexes = {
        @Index(name = "idx_member_email", columnList = "email", unique = true)
})
public class MemberModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    private LocalDate dob;

    @Column(name = "current_status")
    private String currentStatus; // Active, Expired, Banned

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<SubscriptionModel> subscriptions;

    @OneToMany(mappedBy = "member")
    private List<ClassBookingModel> bookings;

    @OneToMany(mappedBy = "member")
    private List<AttendanceLogModel> attendanceLogs;
}
