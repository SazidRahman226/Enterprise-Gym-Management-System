package com.example.gym.controller;

import com.example.gym.model.AttendanceLogModel;
import com.example.gym.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceLogModel> checkIn(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(attendanceService.checkIn(token));
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceLogModel> checkOut(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(attendanceService.checkOut(token));
    }

    @GetMapping("/history")
    public ResponseEntity<List<AttendanceLogModel>> getHistory(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(attendanceService.getMyHistory(token));
    }

    @GetMapping("/all")
    public ResponseEntity<List<AttendanceLogModel>> getAllLogs(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(attendanceService.getAllLogs(token));
    }
}
