package com.example.gym.service;
import com.example.gym.dto.LoginRequest;
import com.example.gym.dto.RegisterRequest;
import com.example.gym.dto.UserDetailsRequest;
import com.example.gym.model.MemberModel;
import com.example.gym.model.UserCredentialModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.UserCredentialRepository;
import com.example.gym.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLOutput;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor

public class MemberService {

    private final UserCredentialRepository userCredentialRepository;
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public ResponseEntity<?> register(@RequestBody RegisterRequest member) {

        if(userCredentialRepository.findByUserEmail(member.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        String hashedPassword = BCrypt.hashpw(member.getPassword(),  BCrypt.gensalt());

        UserCredentialModel user = UserCredentialModel.builder()
                .userEmail(member.getEmail())
                .userType("member")
                .passwordHash(hashedPassword)
                .build();


        userCredentialRepository.save(user);
        String token = jwtUtil.generateToken(user.getUserEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "email", member.getEmail()

                )
        ));
    }

    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        UserCredentialModel _user = userCredentialRepository.findByUserEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!BCrypt.checkpw(loginRequest.getPassword(), _user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(_user.getUserEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "email", _user.getUserEmail()
                )
        ));
    }

    public ResponseEntity<?> createUserDetails(@RequestBody UserDetailsRequest userDetailsRequest, String authHeader)
    {

        String token = authHeader.substring(7);

        if(!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }

        String userEmail = jwtUtil.extractUserEmail(token);


        UserCredentialModel user = userCredentialRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        MemberModel member = MemberModel.builder()
                .firstName(userDetailsRequest.getFirstName())
                .lastName(userDetailsRequest.getLastName())
                .dob(userDetailsRequest.getDob())
                .phone(userDetailsRequest.getPhone())
                .currentStatus("Pending")
                .email(userEmail)
                .emergencyContact(userDetailsRequest.getEmergencyContact())
                .build();

        memberRepository.save(member);
        return ResponseEntity.ok(Map.of(
                "message", "ok",
                "username", member.getFirstName() + " " + member.getLastName(),
                "email", userEmail
        ));
    }

    public ResponseEntity<?> getUserdetails(String authHeader)
    {

        String token = authHeader.substring(7);

        if(!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        else
            System.out.println("Token Valid!");

        String userEmail = jwtUtil.extractUserEmail(token);

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
                "current-status", currentStatus
        ));

    }
}
