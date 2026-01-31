package com.example.gym.controller;

import com.example.gym.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/churn-risk")
    public ResponseEntity<List<Map<String, Object>>> getChurnRisk(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(reportService.getChurnRiskMembers(token));
    }

    @GetMapping("/trainer-performance")
    public ResponseEntity<List<Map<String, Object>>> getTrainerPerformance(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(reportService.getTrainerPerformance(token));
    }
}
