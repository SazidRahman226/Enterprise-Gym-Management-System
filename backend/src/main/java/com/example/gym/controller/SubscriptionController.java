package com.example.gym.controller;

import com.example.gym.config.PaymentRequest;
import com.example.gym.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForSubscription(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("plan") String planName) {
        return subscriptionService.applyForSubscription(authHeader, planName);
    }

    @PostMapping("/pay")
    public ResponseEntity<?> makePayment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PaymentRequest paymentRequest) {
        return subscriptionService.paymentForSubscription(authHeader, paymentRequest);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentSubscription(@RequestHeader("Authorization") String authHeader) {
        return subscriptionService.seeSubsciptionDetail(authHeader);
    }

    @GetMapping("/invoices/pending")
    public ResponseEntity<?> getPendingInvoices(@RequestHeader("Authorization") String authHeader) {
        return subscriptionService.getPendingInvoices(authHeader);
    }
}
