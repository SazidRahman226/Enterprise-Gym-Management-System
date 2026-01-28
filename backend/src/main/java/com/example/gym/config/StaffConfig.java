package com.example.gym.config;

import com.example.gym.model.StaffModel;
import com.example.gym.model.UserCredentialModel;
import com.example.gym.repository.StaffRepository;
import com.example.gym.repository.UserCredentialRepository;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
public class StaffConfig {

    @Bean
    //Creating admin account
    public CommandLineRunner commandLineRunner(UserCredentialRepository userCredentialRepository, StaffRepository staffRepository) {
        return args -> {
            if(userCredentialRepository.findByUserEmail("admin@example.com").isEmpty())
            {
                UserCredentialModel user = UserCredentialModel.builder()
                        .userEmail("admin@example.com")
                        .userType("staff")
                        .passwordHash(BCrypt.hashpw("admin",  BCrypt.gensalt()))
                        .build();

                StaffModel staff = StaffModel.builder()
                        .firstName("admin")
                        .lastName("admin")
                        .role("admin")
                        .email(user.getUserEmail())
                        .salary(BigDecimal.valueOf(30000)).build();

                userCredentialRepository.save(user);
                staffRepository.save(staff);

                System.out.println("✅ Staff Admin account created: admin@example.com");
            }
            else
                System.out.println("Staff Admin account already exists");
        };
    }
}
