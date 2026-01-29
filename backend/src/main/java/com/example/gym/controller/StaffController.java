package com.example.gym.controller;

import com.example.gym.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")

public class StaffController {

    private final StaffService staffService;

    @GetMapping("/pending-request")
    public ResponseEntity<?> getPendingRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader)
    {
        return staffService.getPendingRequest(authHeader);
    }

    @PostMapping("/pending-request/grant/{user_id}")
    public ResponseEntity<?> grantRequest(@PathVariable UUID user_id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader)
    {
        return staffService.alterMemberCurrentStatus(user_id, authHeader, "active");
    }

    @PostMapping("/request/ban/{user_id}")
    public ResponseEntity<?> banMember(@PathVariable UUID user_id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader)
    {
        return staffService.alterMemberCurrentStatus(user_id, authHeader, "banned");
    }
}
