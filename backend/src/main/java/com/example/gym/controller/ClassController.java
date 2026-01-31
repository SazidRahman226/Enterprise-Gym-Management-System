package com.example.gym.controller;

import com.example.gym.dto.ClassScheduleRequest;
import com.example.gym.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    @PostMapping("/schedule")
    public ResponseEntity<?> createSchedule(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ClassScheduleRequest request) {
        return classService.createSchedule(authHeader, request);
    }

    @GetMapping("/schedule")
    public ResponseEntity<?> getAllSchedules() {
        return classService.getAllSchedules();
    }

    @PostMapping("/{scheduleId}/book")
    public ResponseEntity<?> bookClass(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long scheduleId) {
        return classService.bookClass(authHeader, scheduleId);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<?> cancelBooking(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long bookingId) {
        return classService.cancelBooking(authHeader, bookingId);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(@RequestHeader("Authorization") String authHeader) {
        return classService.getMyBookings(authHeader);
    }

    @PutMapping("/bookings/{bookingId}/attendance")
    public ResponseEntity<?> markAttendance(@PathVariable Long bookingId) {
        return classService.markAttendance(bookingId);
    }
}
