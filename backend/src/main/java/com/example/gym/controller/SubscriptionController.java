package com.example.gym.controller;

import com.example.gym.model.MemberModel;
import com.example.gym.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/subscribe")

public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/gold")




}
