package com.example.gym.service;

import com.example.gym.model.EquipmentModel;
import com.example.gym.model.MaintenanceLogModel;
import com.example.gym.repository.EquipmentRepository;
import com.example.gym.repository.MaintenanceLogRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ValidationUtil validationUtil;

    // --- Admin/Staff Only ---

    public EquipmentModel addEquipment(String authHeader, EquipmentModel equipment) {
        validationUtil.isStaffAdmin(authHeader);
        return equipmentRepository.save(equipment);
    }

    public EquipmentModel updateEquipmentStatus(String authHeader, Long id, String status) {
        validationUtil.isStaffAdmin(authHeader);
        EquipmentModel equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));
        equipment.setStatus(status);
        return equipmentRepository.save(equipment);
    }

    public List<EquipmentModel> getAllEquipment(String authHeader) {
        // Validation optional for listing? Let's restrict to Staff/Admin for now, or
        // allow members to see if machines are broken.
        // Assuming secure backend, let's keep it restricted or public info. Sticking to
        // restricted for management.
        validationUtil.isStaffAdmin(authHeader);
        return equipmentRepository.findAll();
    }

    public void deleteEquipment(String authHeader, Long id) {
        validationUtil.isStaffAdmin(authHeader);
        if (!equipmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found");
        }
        equipmentRepository.deleteById(id);
    }

    // --- Maintenance ---

    public MaintenanceLogModel logMaintenance(String authHeader, Long equipmentId, String description, Double cost) {
        validationUtil.isStaffAdmin(authHeader);
        EquipmentModel equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));

        MaintenanceLogModel log = MaintenanceLogModel.builder()
                .equipment(equipment)
                .serviceDate(LocalDate.now())
                .description(description)
                .cost(java.math.BigDecimal.valueOf(cost))
                .technicianName("Staff") // Could extract name from token if needed
                .build();

        // Auto-update status to Maintenance if not already
        if (!"Maintenance".equalsIgnoreCase(equipment.getStatus())) {
            equipment.setStatus("Maintenance");
            equipmentRepository.save(equipment);
        }

        return maintenanceLogRepository.save(log);
    }

    public List<MaintenanceLogModel> getMaintenanceHistory(String authHeader, Long equipmentId) {
        validationUtil.isStaffAdmin(authHeader);
        // Note: Repository might need a custom method for this if not using default
        // relations perfectly,
        // but let's check if we can just fetch via equipment.
        // If MaintenanceLogRepository doesn't have findByEquipmentId, we might need to
        // add it or use equipment.getMaintenanceLogs()
        // Ideally we should use the repository to avoid lazy loading issues if session
        // is closed.
        // Let's assume we can fetch it.
        return maintenanceLogRepository.findAll().stream()
                .filter(log -> log.getEquipment().getEquipId().equals(equipmentId))
                .toList();
    }
}
