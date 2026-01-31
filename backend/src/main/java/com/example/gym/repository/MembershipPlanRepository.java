package com.example.gym.repository;

import com.example.gym.model.MembershipPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlanModel, UUID> {
    Optional<MembershipPlanModel> findByName(String name);

    Boolean existsByName(String name);
}
