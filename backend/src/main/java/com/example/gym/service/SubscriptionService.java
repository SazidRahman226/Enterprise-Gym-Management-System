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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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

    public ResponseEntity<?> applyForSubscription(String authHeader, String subscriptionName) {
        if (!membershipPlanRepository.existsByName(subscriptionName) &&
                !membershipPlanRepository.existsByName(subscriptionName.toLowerCase()) &&
                !membershipPlanRepository.existsByName(
                        subscriptionName.substring(0, 1).toUpperCase() + subscriptionName.substring(1).toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Plan not found: " + subscriptionName);
        }

        if (!validationUtil.findIfMemberExists(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);

        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found."));

        if (member.getSubscriptions() != null && !member.getSubscriptions().getStatus().equals("canceled"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("You already have an " + member.getSubscriptions().getStatus() + " subscription.");

        // Try exact, then capitalized, then lowercase
        MembershipPlanModel plan = membershipPlanRepository.findByName(subscriptionName)
                .or(() -> membershipPlanRepository.findByName(
                        subscriptionName.substring(0, 1).toUpperCase() + subscriptionName.substring(1).toLowerCase()))
                .or(() -> membershipPlanRepository.findByName(subscriptionName.toLowerCase()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membership Plan Not Found"));

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

        return ResponseEntity.ok().body(Map.of(
                "invoice_id", invoice.getInvoiceId().toString(),
                "status", "pending")

        );
    }

    public ResponseEntity<?> paymentForSubscription(String authHeader, PaymentRequest paymentRequest) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        InvoiceModel invoice = invoiceRepository.findById(paymentRequest.getPaymentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found."));

        if (paymentRequest.getAmountPaid().compareTo(invoice.getAmount()) < 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds");

        PaymentModel payment = PaymentModel.builder()
                .invoice(invoice)
                .paymentDate(LocalDate.now())
                .amountPaid(paymentRequest.getAmountPaid())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .transactionRef(paymentRequest.getTransactionRef())
                .build();

        // Update invoice status
        invoice.setStatus("paid");
        invoice.setPayments(payment);

        // Update subscription status
        SubscriptionModel subscription = invoice.getSubscription();
        subscription.setStatus("active");

        paymentRepository.save(payment);
        invoiceRepository.save(invoice);
        subscriptionRepository.save(subscription);

        return ResponseEntity.ok().body(Map.of(
                "message", "payment is in processing"));
    }

    public ResponseEntity<?> seeSubsciptionDetail(String authHeader) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        MemberModel memberModel = memberRepository
                .findByEmail(validationUtil.extractUserEmailFromAuthHeader(authHeader))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN));

        SubscriptionModel subscriptionModel = memberModel.getSubscriptions();

        if (subscriptionModel == null)
            return ResponseEntity.ok().body(Map.of(
                    "status", "inactive",
                    "message", "Subscription Not Found"));
        else {
            return ResponseEntity.ok().body(Map.of(
                    "plan", subscriptionModel.getPlan().getName(),
                    "startDate", subscriptionModel.getStartDate(),
                    "expiresAt", subscriptionModel.getEndDate(),
                    "status", subscriptionModel.getStatus()));
        }

    }

    public ResponseEntity<?> getPendingInvoices(String authHeader) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);
        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        List<InvoiceModel> invoices = invoiceRepository.findUnpaidInvoicesByMember(member.getMemberId());

        if (invoices.isEmpty()) {
            return ResponseEntity.ok().body(Map.of());
        }

        InvoiceModel invoice = invoices.get(0);
        return ResponseEntity.ok().body(Map.of(
                "invoice_id", invoice.getInvoiceId(),
                "status", invoice.getStatus(),
                "plan", invoice.getSubscription().getPlan().getName(),
                "amount", invoice.getAmount()));
    }
}
