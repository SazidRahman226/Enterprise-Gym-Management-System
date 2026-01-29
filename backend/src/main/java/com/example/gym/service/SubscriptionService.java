package com.example.gym.service;

import com.example.gym.config.PaymentRequest;
import com.example.gym.model.*;
import com.example.gym.repository.*;
import com.example.gym.security.JwtUtil;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class SubscriptionService {

    private final ValidationUtil validationUtil;
    private final SubscriptionRepository subscriptionRepository;
    private final MembershipPlanRepository membershipPlanRepository;
    private final MemberRepository memberRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    private final JwtUtil jwtUtil;

    public ResponseEntity<?> applyForSubscription(String authHeader, String subscriptionName)
    {
        if(!membershipPlanRepository.existsByName(subscriptionName))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        if(!validationUtil.findIfMemberExists(authHeader))
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);

        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Member with email " + email + " not found."));

        if(!member.getSubscriptions().getStatus().equals("canceled"))
            throw new RuntimeException("current subscription status is still " + member.getSubscriptions().getStatus());

        MembershipPlanModel plan = membershipPlanRepository.findByName(subscriptionName)
                .orElseThrow(() -> new RuntimeException("Membership Plan Not Found"));

        SubscriptionModel subscription = SubscriptionModel.builder()
                .plan(plan)
                .status("pending")
                .member(member)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(plan.getDurationDays()))
                .build();

        InvoiceModel invoice = InvoiceModel.builder()
                .subscription(subscription)
                .amount(plan.getDiscountedFee())
                .dueDate(LocalDate.now().plusDays(7))
                .status("pending")
                .build();

        member.setSubscriptions(subscription);


        memberRepository.save(member);
        subscriptionRepository.save(subscription);
        invoiceRepository.save(invoice);

        return ResponseEntity.ok().body( Map.of(
                "invoice_id", invoice.getInvoiceId(),
                "status", "pending"
                )

        );
    }

    public ResponseEntity<?> paymentForSubscription(String authHeader, PaymentRequest paymentRequest)
    {
        if (!validationUtil.findIfMemberExists(authHeader))
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        InvoiceModel invoice = invoiceRepository.findById(paymentRequest.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Invoice with not found."));

        if( paymentRequest.getAmountPaid().compareTo(invoice.getAmount()) < 0 )
            throw new RuntimeException("Insufficient funds");

        PaymentModel payment = PaymentModel.builder()
                .invoice(invoice)
                .paymentDate(LocalDate.now())
                .amountPaid(paymentRequest.getAmountPaid())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .transactionRef(paymentRequest.getTransactionRef())
                .build();

        invoice.setPayments(payment);

        paymentRepository.save(payment);
        invoiceRepository.save(invoice);

        return ResponseEntity.ok().body( Map.of(
                "message", "payment is in processing"
        ));

    }
}
