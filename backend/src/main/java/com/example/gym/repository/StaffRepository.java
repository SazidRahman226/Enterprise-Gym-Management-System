package com.example.gym.repository;

import com.example.gym.model.StaffModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StaffRepository extends JpaRepository<StaffModel, UUID> {
    List<StaffModel> findByRole(String role);
    Optional<StaffModel> findByEmail(String email);
    Boolean existsByEmailAndRole(String email, String role);
}
