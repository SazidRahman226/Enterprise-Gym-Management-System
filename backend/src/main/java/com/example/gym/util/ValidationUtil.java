package com.example.gym.security;

import com.example.gym.model.MemberModel;
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
    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;

    //extract user email from authentication header
    public String extractUserEmailFromAuthHeader(String authHeader) {
        String token = authHeader.substring(7);

        if(!jwtUtil.validateToken(token))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");

        return jwtUtil.extractUserEmail(token);
    }

    public void validateUserAuthorization(String authHeader, String role) {

        String email = extractUserEmailFromAuthHeader(authHeader);
        UserCredentialModel user = userCredentialRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if(!user.getUserType().equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied!");
    }

    //validates if the token is of staff member with a desired role
    public void validateStaffAuthorization(String authHeader, String role) {
        String email = extractUserEmailFromAuthHeader(authHeader);

        validateUserAuthorization(email, "staff");

        StaffModel staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found"));

        if(!staff.getRole().equals(role))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff role is not " + role);
    }




    //validates if the token is of a registered member
    public void validateMemberAuthorization(String authHeader, String status)
    {
        String email = extractUserEmailFromAuthHeader(authHeader);
        validateUserAuthorization(email, "member");

        MemberModel member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        if(!member.getCurrentStatus().equals(status))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Member status is not " + status);

    }

    //validates if the member is currently active
    public void isMemberActive(String authHeader)
    {
        validateMemberAuthorization(authHeader, "active");
    }

    public void isStaffAdmin(String authHeader)
    {
        validateStaffAuthorization(authHeader, "admin");
    }
}
