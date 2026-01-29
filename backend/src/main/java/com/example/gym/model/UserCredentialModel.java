package com.example.gym.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserCredentialModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(nullable = false)
    private String userType; // "member" or "staff"

    @Column(nullable = false, unique = true)
    private String userEmail;

    @Column(nullable = false)
    private String passwordHash;

    @Column
    private LocalDateTime lastLogin;

    @PrePersist
    public void setLastLogin() {
        lastLogin = LocalDateTime.now();
    }
}
