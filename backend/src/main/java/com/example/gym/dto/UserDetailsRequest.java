package com.example.gym.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserDetailsRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String emergencyContact;
    private LocalDate dob;
}
