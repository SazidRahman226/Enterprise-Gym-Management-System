package com.example.gym.repository;

import com.example.gym.model.SubscriptionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionModel, UUID> {

    List<SubscriptionModel> findByMemberMemberIdAndStatus(Long memberId, String status);

    @Query("SELECT s FROM SubscriptionModel s WHERE s.endDate <= :expiryDate AND s.status = 'Active'")
    List<SubscriptionModel> findExpiringSubscriptions(@Param("expiryDate") LocalDate expiryDate);
}