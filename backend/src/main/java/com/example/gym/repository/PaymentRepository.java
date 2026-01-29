package com.example.gym.repository;

import com.example.gym.model.PaymentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentModel, UUID> {
    List<PaymentModel> findByInvoiceInvoiceId(Long invoiceId);

    @Query("SELECT SUM(p.amountPaid) FROM PaymentModel p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    Double calculateTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
