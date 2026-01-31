package com.example.gym.repository;

import com.example.gym.model.InvoiceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceModel, UUID> {
    // Find unpaid invoices for a specific member
    @Query("SELECT i FROM InvoiceModel i JOIN i.subscription s WHERE s.member.memberId = :memberId AND i.status = 'pending'")
    List<InvoiceModel> findUnpaidInvoicesByMember(@Param("memberId") UUID memberId);

    Optional<InvoiceModel> findByInvoiceId(UUID invoiceId);

    Boolean existsByInvoiceId(UUID invoiceId);

    @Query("SELECT SUM(i.amount) FROM InvoiceModel i WHERE i.status = 'paid'")
    Double sumRevenue();
}