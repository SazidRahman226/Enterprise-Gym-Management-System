package com.example.gym.config;

import com.example.gym.model.MembershipPlanModel;
import com.example.gym.repository.MembershipPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class MembershipPlanConfig {

    @Bean
    public CommandLineRunner initMembershipPlans(MembershipPlanRepository repository) {
        return args -> {
            // 1. Check if plans already exist (Idempotency Check)
            // If the database is not empty, we stop here to avoid creating duplicates.
            if (repository.count() > 0) {
                return;
            }

            // 2. Create "Silver" Plan (Monthly, no discount)
            MembershipPlanModel silver = MembershipPlanModel.builder()
                    .name("Silver")
                    .durationDays(30)
                    .baseFee(new BigDecimal("50.00"))       // $50
                    .discountedFee(new BigDecimal("50.00")) // No discount
                    .build();

            // 3. Create "Gold" Plan (Quarterly, slight discount)
            MembershipPlanModel gold = MembershipPlanModel.builder()
                    .name("Gold")
                    .durationDays(90)
                    .baseFee(new BigDecimal("150.00"))      // $150 value
                    .discountedFee(new BigDecimal("130.00")) // $20 off
                    .build();

            // 4. Create "Platinum" Plan (Yearly, big discount)
            MembershipPlanModel platinum = MembershipPlanModel.builder()
                    .name("Platinum")
                    .durationDays(365)
                    .baseFee(new BigDecimal("600.00"))      // $600 value
                    .discountedFee(new BigDecimal("450.00")) // $150 off!
                    .build();

            // 5. Save all to database
            repository.saveAll(List.of(silver, gold, platinum));

            System.out.println("✅ Default Membership Plans (Silver, Gold, Platinum) created.");
        };
    }
}