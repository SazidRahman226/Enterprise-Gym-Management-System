package com.example.gym.repository;

import com.example.gym.model.UserCredentialModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialRepository extends JpaRepository<UserCredentialModel, Long> {
    Optional<UserCredentialModel> findByUsername(String username);
    Optional<UserCredentialModel> findByForeignIdAndUserType(Long foreignId, String userType);
}
