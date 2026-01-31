package com.example.gym.service;

import com.example.gym.model.FacilityRoomModel;
import com.example.gym.repository.FacilityRoomRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRoomRepository facilityRoomRepository;
    private final ValidationUtil validationUtil;

    public FacilityRoomModel addRoom(String authHeader, FacilityRoomModel room) {
        validationUtil.isStaffAdmin(authHeader);
        return facilityRoomRepository.save(room);
    }

    public List<FacilityRoomModel> getAllRooms() {
        // Publicly visible for schedule checking? Or just internal?
        // Let's allow generally.
        return facilityRoomRepository.findAll();
    }

    public FacilityRoomModel updateRoom(String authHeader, Long id, FacilityRoomModel details) {
        validationUtil.isStaffAdmin(authHeader);
        FacilityRoomModel room = facilityRoomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        if (details.getName() != null)
            room.setName(details.getName());
        if (details.getCapacity() != null)
            room.setCapacity(details.getCapacity());
        if (details.getRoomType() != null)
            room.setRoomType(details.getRoomType());

        return facilityRoomRepository.save(room);
    }

    public void deleteRoom(String authHeader, Long id) {
        validationUtil.isStaffAdmin(authHeader);
        if (!facilityRoomRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }
        facilityRoomRepository.deleteById(id);
    }
}
