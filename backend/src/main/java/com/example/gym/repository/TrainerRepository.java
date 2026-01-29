package com.example.gym.repository;

import com.example.gym.model.TrainerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainerRepository extends JpaRepository<TrainerModel, UUID> {
    List<TrainerModel> findByOrderByCommissionRateDesc();
}
