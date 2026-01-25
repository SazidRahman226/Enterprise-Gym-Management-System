package com.example.gym.repository;

import com.example.gym.model.FacilityRoomModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRoomRepository extends JpaRepository<FacilityRoomModel, Long> {
}