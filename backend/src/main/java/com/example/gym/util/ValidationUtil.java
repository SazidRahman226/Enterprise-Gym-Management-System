package com.example.gym.util;

import com.example.gym.model.MemberModel;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.StaffRepository;
import com.example.gym.repository.UserCredentialRepository;
import com.example.gym.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Component
public class ValidationUtil {

    private final StaffRepository staffRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;

    // extract user email from authentication header
    public String extractUserEmailFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");

        return jwtUtil.extractUserEmail(token);
    }

    public Boolean validateUserAuthorization(String authHeader, String role) {

        String email = extractUserEmailFromAuthHeader(authHeader);
        return userCredentialRepository.existsByUserEmailAndUserType(email, role);
    }

    // validates if the token is of staff member with a desired role
    public Boolean validateStaffAuthorization(String authHeader, String role) {

        String email = extractUserEmailFromAuthHeader(authHeader);
        return staffRepository.existsByEmailAndRole(email, role);
    }

    // validates if the token is of a registered member
    public Boolean validateMemberAuthorization(String authHeader, String status) {
        String email = extractUserEmailFromAuthHeader(authHeader);

        return memberRepository.existsByEmailAndCurrentStatus(email, status);

    }

    // checks if the member is currently active
    public Boolean isMemberActive(String authHeader) {
        return validateMemberAuthorization(authHeader, "active");
    }

    // checks if the staff is an admin
    public void isStaffAdmin(String authHeader) {
        validateStaffAuthorization(authHeader, "admin");
    }

    // checks if the staff is an admin
    public Boolean findIfMemberExists(String authHeader) {
        return validateUserAuthorization(authHeader, "member");
    }

}
