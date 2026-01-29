package com.example.gym.controller;

import com.example.gym.dto.LoginRequest;
import com.example.gym.dto.MemberRegisterRequest;
import com.example.gym.dto.UserDetailsRequest;
import com.example.gym.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")

public class MemberController {


    private final MemberService memberService;

    //register new users
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody MemberRegisterRequest member) {

        return memberService.register(member); //Initial registration just using email and password

    }

    //login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

       return memberService.login(loginRequest); //Login using email and password

    }

//    //filling up user details
//    @PostMapping("/userdetails")
//    public ResponseEntity<?> userDetails(@RequestBody UserDetailsRequest userDetailsRequest, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
//
//        return memberService.createUserDetails(userDetailsRequest, authHeader); //Giving user detailed info
//
//    }

    //getting user information
    @GetMapping("/userdetails")
    public ResponseEntity<?> getUserDetails(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {

        return memberService.getUserdetails(authHeader); //Get user information

    }
}
