package com.example.gym.repository;

import com.example.gym.model.InvoiceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<InvoiceModel, Long> {
    // Find unpaid invoices for a specific member
    @Query("SELECT i FROM InvoiceModel i JOIN i.subscription s WHERE s.member.memberId = :memberId AND i.status = 'Unpaid'")
    List<InvoiceModel> findUnpaidInvoicesByMember(@Param("memberId") Long memberId);
}