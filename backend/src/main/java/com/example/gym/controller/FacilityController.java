package com.example.gym.controller;

import com.example.gym.model.FacilityRoomModel;
import com.example.gym.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping
    public ResponseEntity<FacilityRoomModel> addRoom(@RequestHeader("Authorization") String token,
            @RequestBody FacilityRoomModel room) {
        return ResponseEntity.ok(facilityService.addRoom(token, room));
    }

    @GetMapping
    public ResponseEntity<List<FacilityRoomModel>> getAllRooms() {
        return ResponseEntity.ok(facilityService.getAllRooms());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacilityRoomModel> updateRoom(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody FacilityRoomModel room) {
        return ResponseEntity.ok(facilityService.updateRoom(token, id, room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        facilityService.deleteRoom(token, id);
        return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
    }
}
