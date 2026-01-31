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
    public ResponseEntity<?> getPendingRequest(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.getPendingRequest(authHeader);
    }

    @GetMapping("/pending-trainers")
    public ResponseEntity<?> getPendingTrainers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.getPendingTrainers(authHeader);
    }

    @PostMapping("/pending-trainers/approve/{trainer_id}")
    public ResponseEntity<?> approveTrainer(@PathVariable UUID trainer_id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.alterTrainerStatus(trainer_id, authHeader, "hired");
    }

    @PostMapping("/pending-trainers/reject/{trainer_id}")
    public ResponseEntity<?> rejectTrainer(@PathVariable UUID trainer_id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.alterTrainerStatus(trainer_id, authHeader, "rejected");
    }

    @PostMapping("/pending-request/grant/{user_id}")
    public ResponseEntity<?> grantRequest(@PathVariable UUID user_id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.alterMemberCurrentStatus(user_id, authHeader, "active");
    }

    @PostMapping("/request/ban/{user_id}")
    public ResponseEntity<?> banMember(@PathVariable UUID user_id,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return staffService.alterMemberCurrentStatus(user_id, authHeader, "banned");
    }
}
