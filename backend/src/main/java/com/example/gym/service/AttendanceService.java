package com.example.gym.service;

import com.example.gym.model.AttendanceLogModel;
import com.example.gym.model.MemberModel;
import com.example.gym.repository.AttendanceLogRepository;
import com.example.gym.repository.MemberRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final MemberRepository memberRepository;
    private final ValidationUtil validationUtil;

    public AttendanceLogModel checkIn(String authHeader) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);
        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        // Check for active subscription
        if (member.getSubscriptions() == null ||
                !"active".equalsIgnoreCase(member.getSubscriptions().getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Active subscription required to check in.");
        }

        if (member.getSubscriptions().getEndDate().isBefore(java.time.LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Subscription expired on " + member.getSubscriptions().getEndDate());
        }

        // Check if already checked in without check out? (Simplification: Just create
        // new log)

        AttendanceLogModel log = AttendanceLogModel.builder()
                .member(member)
                .checkInTime(LocalDateTime.now())
                .build();

        return attendanceLogRepository.save(log);
    }

    public AttendanceLogModel checkOut(String authHeader) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);
        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        // Find latest log without checkout time
        List<AttendanceLogModel> activeLogs = attendanceLogRepository.findActiveCheckIns(member.getMemberId());

        AttendanceLogModel latestLog = activeLogs.stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active check-in found"));

        latestLog.setCheckOutTime(LocalDateTime.now());
        return attendanceLogRepository.save(latestLog);
    }

    public List<AttendanceLogModel> getMyHistory(String authHeader) {
        if (!validationUtil.findIfMemberExists(authHeader)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        String email = validationUtil.extractUserEmailFromAuthHeader(authHeader);
        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        // Filtering in memory again for safety given I can't check repo methods easily
        // without listing
        return attendanceLogRepository.findAll().stream()
                .filter(l -> l.getMember().getMemberId().equals(member.getMemberId()))
                .toList();
    }

    public List<AttendanceLogModel> getAllLogs(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);
        return attendanceLogRepository.findAll();
    }
}
