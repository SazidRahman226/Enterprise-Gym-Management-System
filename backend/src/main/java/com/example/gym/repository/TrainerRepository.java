package com.example.gym.repository;

import com.example.gym.model.TrainerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<TrainerModel, Long> {
    List<TrainerModel> findByOrderByCommissionRateDesc();
}
