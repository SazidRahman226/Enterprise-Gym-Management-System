package com.example.gym.repository;

import com.example.gym.model.MembershipPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlanModel, Long> {
    List<MembershipPlanModel> findByName(String name);
}
