package com.example.gym.controller;

import com.example.gym.dto.LoginRequest;
import com.example.gym.dto.MemberRegisterRequest;
import com.example.gym.dto.TrainerRegister;
import com.example.gym.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")

public class AuthController {


    private final AuthService authService;

    //register new users
    @PostMapping("/register/member")
    public ResponseEntity<?> registerMember(@RequestBody MemberRegisterRequest member) {

        return authService.registerMember(member); //Initial registration just using email and password

    }

    @PostMapping("/register/trainer")
    public ResponseEntity<?> registerTrainer(@RequestBody TrainerRegister trainer) {

        return authService.registerTrainer(trainer); //Initial registration just using email and password

    }

    //login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

       return authService.login(loginRequest); //Login using email and password

    }

//    //filling up user details
//    @PostMapping("/userdetails")
//    public ResponseEntity<?> userDetails(@RequestBody UserDetailsRequest userDetailsRequest, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
//
//        return authService.createUserDetails(userDetailsRequest, authHeader); //Giving user detailed info
//
//    }

    //getting user information
    @GetMapping("/userdetails")
    public ResponseEntity<?> getUserDetails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        return authService.getUserdetails(authHeader); //Get user information

    }
}
