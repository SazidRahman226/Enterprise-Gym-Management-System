package com.example.gym.service;

import com.example.gym.model.MemberModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@Service
@RequestMapping
@RequiredArgsConstructor

public class StaffService {

    private final MemberRepository memberRepository;
    private final ValidationUtil validationUtil;

    public ResponseEntity<?> getPendingRequest(String authHeader)
    {
        validationUtil.isStaffAdmin(authHeader);
        return ResponseEntity.ok(memberRepository.findPendingMembers("pending"));
    }

    public ResponseEntity<?> alterMemberCurrentStatus(@PathVariable UUID uuid, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader, String currentStatus)
    {
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
                        "current-status", currentStatus
                )
        ));
    }
}
