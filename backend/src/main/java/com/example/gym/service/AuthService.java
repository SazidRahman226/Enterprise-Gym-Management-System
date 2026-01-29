package com.example.gym.service;

import com.example.gym.dto.LoginRequest;
import com.example.gym.dto.MemberRegisterRequest;
import com.example.gym.dto.TrainerRegister;
import com.example.gym.dto.UserDetailsRequest;
import com.example.gym.model.MemberModel;
import com.example.gym.model.StaffModel;
import com.example.gym.model.TrainerModel;
import com.example.gym.model.UserCredentialModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.StaffRepository;
import com.example.gym.repository.TrainerRepository;
import com.example.gym.repository.UserCredentialRepository;
import com.example.gym.security.JwtUtil;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class AuthService {

        private final UserCredentialRepository userCredentialRepository;
        private final JwtUtil jwtUtil;
        private final MemberRepository memberRepository;
        private final ValidationUtil validationUtil;
        private final StaffRepository staffRepository;
        private final TrainerRepository trainerRepository;

        public ResponseEntity<?> registerMember(@RequestBody MemberRegisterRequest member) {

                if (userCredentialRepository.findByUserEmail(member.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().build();
                }

                String hashedPassword = BCrypt.hashpw(member.getPassword(), BCrypt.gensalt());

                UserCredentialModel user = UserCredentialModel.builder()
                                .userEmail(member.getEmail())
                                .userType("member")
                                .passwordHash(hashedPassword)
                                .build();

                MemberModel memberModel = MemberModel.builder()
                                .firstName(member.getFirstName())
                                .lastName(member.getLastName())
                                .email(member.getEmail())
                                .phone(member.getPhone())
                                .emergencyContact(member.getEmergencyContact())
                                .dob(member.getDob())
                                .currentStatus("pending")
                                .build();

                userCredentialRepository.save(user);
                memberRepository.save(memberModel);

                String token = jwtUtil.generateToken(user.getUserEmail());

                return ResponseEntity.ok(Map.of(
                                "token", token,
                                "email", member.getEmail()));
        }

        public ResponseEntity<?> registerTrainer(@RequestBody TrainerRegister trainer) {

                if (userCredentialRepository.findByUserEmail(trainer.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().build();
                }

                String hashedPassword = BCrypt.hashpw(trainer.getPassword(), BCrypt.gensalt());

                UserCredentialModel user = UserCredentialModel.builder()
                                .userEmail(trainer.getEmail())
                                .userType("staff")
                                .passwordHash(hashedPassword)
                                .build();

                StaffModel staff = StaffModel.builder()
                                .firstName(trainer.getFirstName())
                                .lastName(trainer.getLastName())
                                .email(trainer.getEmail())
                                .role("trainer")
                                .build();

                TrainerModel trainerModel = TrainerModel.builder()
                                .staff(staff)
                                .specialization(trainer.getSpecialization())
                                .shortDescription(trainer.getShortDescription())
                                .status("pending")
                                .build();

                staff.setTrainerProfile(trainerModel);

                userCredentialRepository.save(user);
                staffRepository.save(staff);
                trainerRepository.save(trainerModel);

                String token = jwtUtil.generateToken(user.getUserEmail());

                return ResponseEntity.ok(Map.of(
                                "token", token,
                                "email", trainer.getEmail()));
        }

        public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

                UserCredentialModel _user = userCredentialRepository.findByUserEmail(loginRequest.getEmail())
                                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

                if (!BCrypt.checkpw(loginRequest.getPassword(), _user.getPasswordHash())) {
                        throw new RuntimeException("Invalid email or password");
                }

                String token = jwtUtil.generateToken(_user.getUserEmail());

                String role = "";

                if (_user.getUserType().equals("member")) {
                        role = "member";
                } else if (_user.getUserType().equals("staff")) {

                        StaffModel staff = staffRepository.findByEmail(loginRequest.getEmail())
                                        .orElseThrow(() -> new RuntimeException("Access denied!"));

                        role = staff.getRole();
                }

                return ResponseEntity.ok(Map.of(
                                "token", token,
                                "email", _user.getUserEmail(),
                                "role", role));
        }

        public ResponseEntity<?> createUserDetails(@RequestBody UserDetailsRequest userDetailsRequest,
                        String authHeader) {

                String userEmail = validationUtil.extractUserEmailFromAuthHeader(authHeader);

                MemberModel member = MemberModel.builder()
                                .firstName(userDetailsRequest.getFirstName())
                                .lastName(userDetailsRequest.getLastName())
                                .dob(userDetailsRequest.getDob())
                                .phone(userDetailsRequest.getPhone())
                                .currentStatus("pending")
                                .email(userEmail)
                                .emergencyContact(userDetailsRequest.getEmergencyContact())
                                .build();

                memberRepository.save(member);
                return ResponseEntity.ok(Map.of(
                                "message", "ok",
                                "username", member.getFirstName() + " " + member.getLastName(),
                                "email", userEmail));
        }

        public ResponseEntity<?> getMemberDetails(String authHeader) {

                String userEmail = validationUtil.extractUserEmailFromAuthHeader(authHeader);

                MemberModel memberModel = memberRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User details not found"));

                String username = memberModel.getFirstName() + " " + memberModel.getLastName();
                LocalDate dob = memberModel.getDob();
                String phone = memberModel.getPhone();
                String currentStatus = memberModel.getCurrentStatus();
                String emergencyContact = memberModel.getEmergencyContact();

                return ResponseEntity.ok(Map.of(
                                "username", username,
                                "email", userEmail,
                                "dob", dob,
                                "phone", phone,
                                "emergency-contact", emergencyContact,
                                "current-status", currentStatus));

        }

        public ResponseEntity<?> getTrainerDetails(String authHeader) {

                String staffEmail = validationUtil.extractUserEmailFromAuthHeader(authHeader);

                StaffModel staffModel = staffRepository.findByEmail(staffEmail)
                                .orElseThrow(() -> new RuntimeException("User details not found"));

                if (staffModel.getTrainerProfile() == null)
                        throw new RuntimeException("Unable to find trainer profile ");

                String username = staffModel.getFirstName() + " " + staffModel.getLastName();
                String role = staffModel.getRole();
                String description = staffModel.getTrainerProfile().getShortDescription();
                String specialization = staffModel.getTrainerProfile().getSpecialization();
                String status = staffModel.getTrainerProfile().getStatus();

                return ResponseEntity.ok(Map.of(
                                "username", username,
                                "email", staffEmail,
                                "role", role,
                                "description", description,
                                "specialization", specialization,
                                "status", status));

        }
}
