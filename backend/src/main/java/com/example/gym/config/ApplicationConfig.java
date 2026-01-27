package com.example.gym.config;

import com.example.gym.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserCredentialRepository userCredentialRepository;



}
