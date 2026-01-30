package com.example.gym.config;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
public class PaymentRequest {

    private UUID paymentId;
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String transactionRef;
}
