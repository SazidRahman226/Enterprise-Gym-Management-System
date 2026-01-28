package com.example.gym.util;

import com.example.gym.model.MemberModel;
import com.example.gym.model.StaffModel;
import com.example.gym.model.UserCredentialModel;
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

    //extract user email from authentication header
    public String extractUserEmailFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);

        if(!jwtUtil.validateToken(token))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");

        return jwtUtil.extractUserEmail(token);
    }

    public String validateUserAuthorization(String authHeader, String role) {

        String email = extractUserEmailFromAuthHeader(authHeader);
        UserCredentialModel user = userCredentialRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if(!user.getUserType().equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied!");

        return email;
    }

    //validates if the token is of staff member with a desired role
    public String validateStaffAuthorization(String authHeader, String role) {

        String email = validateUserAuthorization(authHeader, "staff");

        StaffModel staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found"));

        if(!staff.getRole().equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff role is not " + role);

        return email;
    }




    //validates if the token is of a registered member
    public void validateMemberAuthorization(String authHeader, String status)
    {
        String email = validateUserAuthorization(authHeader, "member");

        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        if(!member.getCurrentStatus().equals(status))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Member status is not " + status);

    }

    //checks if the member is currently active
    public void isMemberActive(String authHeader)
    {
        validateMemberAuthorization(authHeader, "active");
    }

    //checks if the staff is an admin
    public void isStaffAdmin(String authHeader)
    {
        validateStaffAuthorization(authHeader, "admin");
    }
}
