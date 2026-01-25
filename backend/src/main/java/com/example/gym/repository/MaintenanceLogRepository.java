package com.example.gym.repository;

import com.example.gym.model.MaintenanceLogModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLogModel, Long> {
    List<MaintenanceLogModel> findByEquipmentEquipId(Long equipId);
}
