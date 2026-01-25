package com.example.gym.repository;

import com.example.gym.model.SubscriptionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<SubscriptionModel, Long> {

    List<SubscriptionModel> findByMemberMemberIdAndStatus(Long memberId, String status);

    @Query("SELECT s FROM SubscriptionModel s WHERE s.endDate <= :expiryDate AND s.status = 'Active'")
    List<SubscriptionModel> findExpiringSubscriptions(@Param("expiryDate") LocalDate expiryDate);
}