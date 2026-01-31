package com.example.gym.service;

import com.example.gym.repository.InvoiceRepository;
import com.example.gym.repository.MemberRepository;
import com.example.gym.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MemberRepository memberRepository;
    private final InvoiceRepository invoiceRepository;
    private final ValidationUtil validationUtil;

    public Map<String, Object> getAdminStats(String authHeader) {
        validationUtil.isStaffAdmin(authHeader);

        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.findByCurrentStatus("active").size(); // Assuming status is 'active' or
                                                                                    // 'Active'
        // Ideally case-insensitive, but sticking to existing pattern.

        Double totalRevenue = invoiceRepository.sumRevenue();
        if (totalRevenue == null)
            totalRevenue = 0.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", totalMembers);
        stats.put("activeMembers", activeMembers);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }
}
