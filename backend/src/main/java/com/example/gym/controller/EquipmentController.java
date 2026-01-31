package com.example.gym.controller;

import com.example.gym.model.EquipmentModel;
import com.example.gym.model.MaintenanceLogModel;
import com.example.gym.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping
    public ResponseEntity<EquipmentModel> addEquipment(@RequestHeader("Authorization") String token,
            @RequestBody EquipmentModel equipment) {
        return ResponseEntity.ok(equipmentService.addEquipment(token, equipment));
    }

    @GetMapping
    public ResponseEntity<List<EquipmentModel>> getAllEquipment(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(equipmentService.getAllEquipment(token));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EquipmentModel> updateStatus(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(equipmentService.updateEquipmentStatus(token, id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        equipmentService.deleteEquipment(token, id);
        return ResponseEntity.ok(Map.of("message", "Equipment deleted successfully"));
    }

    @PostMapping("/{id}/maintenance")
    public ResponseEntity<MaintenanceLogModel> logMaintenance(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        String description = (String) payload.get("description");
        Double cost = payload.containsKey("cost") ? Double.valueOf(payload.get("cost").toString()) : 0.0;
        return ResponseEntity.ok(equipmentService.logMaintenance(token, id, description, cost));
    }

    @GetMapping("/{id}/maintenance")
    public ResponseEntity<List<MaintenanceLogModel>> getMaintenanceHistory(@RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getMaintenanceHistory(token, id));
    }
}
