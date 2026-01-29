package com.example.gym.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainerRegister {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String specialization;
    private String shortDescription;

}
