package com.example.gym.security;

import com.example.gym.model.StaffModel;
import com.example.gym.model.UserCredentialModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.StaffRepository;
import com.example.gym.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Component
public class ValidationUtil {

    private final StaffRepository staffRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final JwtUtil jwtUtil;

    public void validateStaff(String authHeader, String role)
    {
        String token = authHeader.substring(7);

        if(!jwtUtil.validateToken(token))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");

        System.out.println("valid token");

        String email = jwtUtil.extractUserEmail(token);

        StaffModel staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found"));

        System.out.println("valid staff");

        if(!staff.getRole().equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff role is not " + role);

        System.out.println("valid access");

        UserCredentialModel user = userCredentialRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        System.out.println("user found");

        if(!user.getUserType().equals("Staff"))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied!");

        System.out.println("user found");

    }
}
