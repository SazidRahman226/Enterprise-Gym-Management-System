package com.example.gym.service;

import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@RequestMapping

public class SubscriptionService {

    private final ValidationUtil validationUtil;

//    public ResponseEntity<?> goldSubscription(String authHeader)
//    {
//        if(!validationUtil.findIfMemberExists(authHeader))
//        {
//            return ResponseEntity.badRequest().build();
//        }
//    }
}
