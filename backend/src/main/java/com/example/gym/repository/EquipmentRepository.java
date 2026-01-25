package com.example.gym.repository;

import com.example.gym.model.EquipmentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<EquipmentModel, Long> {
    List<EquipmentModel> findByStatus(String status);
}
