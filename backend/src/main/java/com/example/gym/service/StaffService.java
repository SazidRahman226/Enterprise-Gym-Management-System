package com.example.gym.service;

import com.example.gym.model.MemberModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class StaffService {

    private final MemberRepository memberRepository;
    private final com.example.gym.repository.TrainerRepository trainerRepository;
    private final ValidationUtil validationUtil;

    public ResponseEntity<?> getPendingRequest(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);
        return ResponseEntity.ok(memberRepository.findPendingMembers("pending"));
    }

    public ResponseEntity<?> getPendingTrainers(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);
        java.util.List<com.example.gym.model.TrainerModel> trainers = trainerRepository.findByStatus("pending");

        return ResponseEntity.ok(trainers.stream().map(t -> {
            com.example.gym.model.StaffModel s = t.getStaff();
            return Map.of(
                    "trainerId", t.getTrainerId(),
                    "firstName", s.getFirstName(),
                    "lastName", s.getLastName(),
                    "email", s.getEmail(),
                    "specialization", t.getSpecialization(),
                    "shortDescription", t.getShortDescription() != null ? t.getShortDescription() : "",
                    "status", t.getStatus());
        }).collect(java.util.stream.Collectors.toList()));
    }

    public ResponseEntity<?> alterMemberCurrentStatus(@PathVariable UUID uuid, String authHeader,
            String currentStatus) {
        validationUtil.isStaffAdmin(authHeader);
        MemberModel memberModel = memberRepository.findByMemberId(uuid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        String previousStatus = memberModel.getCurrentStatus();
        memberModel.setCurrentStatus(currentStatus);
        memberRepository.save(memberModel);

        return ResponseEntity.ok(Map.of(
                "message", "Status changed from " + previousStatus + " to " + currentStatus,
                "member", Map.of(
                        "user-email", memberModel.getEmail(),
                        "current-status", currentStatus)));
    }

    public ResponseEntity<?> alterTrainerStatus(@PathVariable UUID trainerId, String authHeader, String status) {
        validationUtil.isStaffAdmin(authHeader);
        com.example.gym.model.TrainerModel trainerModel = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found"));

        String previousStatus = trainerModel.getStatus();
        trainerModel.setStatus(status);
        trainerRepository.save(trainerModel);

        return ResponseEntity.ok(Map.of(
                "message", "Trainer status changed from " + previousStatus + " to " + status,
                "trainerId", trainerId));
    }
}
