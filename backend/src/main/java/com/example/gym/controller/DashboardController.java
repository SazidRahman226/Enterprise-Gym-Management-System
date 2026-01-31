package com.example.gym.controller;

import com.example.gym.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin-stats")
    public ResponseEntity<Map<String, Object>> getAdminStats(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(dashboardService.getAdminStats(token));
    }
}
