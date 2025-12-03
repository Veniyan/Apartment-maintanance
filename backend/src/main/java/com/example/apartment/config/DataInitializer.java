package com.example.apartment.config;

import com.example.apartment.model.User;
import com.example.apartment.model.MaintenancePayment;
import com.example.apartment.model.MaintenanceRequest;
import com.example.apartment.model.Expense;
import com.example.apartment.repository.UserRepository;
import com.example.apartment.repository.MaintenancePaymentRepository;
import com.example.apartment.repository.MaintenanceRepository;
import com.example.apartment.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaintenancePaymentRepository paymentRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create users
        User admin = null;
        User user1 = null;

        if (userRepository.findByUsername("admin").isEmpty()) {
            admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setRole("ADMIN");
            admin = userRepository.save(admin);
            System.out.println("✅ Admin user created: admin / admin123");
        } else {
            admin = userRepository.findByUsername("admin").get();
        }

        if (userRepository.findByUsername("user1").isEmpty()) {
            user1 = new User();
            user1.setUsername("user1");
            user1.setPassword(passwordEncoder.encode("pass123"));
            user1.setEmail("user1@example.com");
            user1.setRole("USER");
            user1 = userRepository.save(user1);
            System.out.println("✅ User created: user1 / pass123");
        } else {
            user1 = userRepository.findByUsername("user1").get();
        }

        // Create sample payments
        if (paymentRepository.count() == 0) {
            // Current month payment (unpaid)
            MaintenancePayment payment1 = new MaintenancePayment();
            payment1.setUser(user1);
            payment1.setMonth(LocalDate.now().toString().substring(0, 7)); // "2024-12"
            payment1.setAmount(5000.0);
            payment1.setIsPaid(false);
            paymentRepository.save(payment1);

            // Last month payment (paid)
            MaintenancePayment payment2 = new MaintenancePayment();
            payment2.setUser(user1);
            payment2.setMonth(LocalDate.now().minusMonths(1).toString().substring(0, 7));
            payment2.setAmount(5000.0);
            payment2.setIsPaid(true);
            payment2.setPaymentDate(LocalDate.now().minusMonths(1).plusDays(5));
            paymentRepository.save(payment2);

            // Two months ago (paid)
            MaintenancePayment payment3 = new MaintenancePayment();
            payment3.setUser(user1);
            payment3.setMonth(LocalDate.now().minusMonths(2).toString().substring(0, 7));
            payment3.setAmount(5000.0);
            payment3.setIsPaid(true);
            payment3.setPaymentDate(LocalDate.now().minusMonths(2).plusDays(3));
            paymentRepository.save(payment3);

            System.out.println("✅ Sample payments created");
        }

        // Create sample maintenance requests
        if (maintenanceRepository.count() == 0) {
            MaintenanceRequest request1 = new MaintenanceRequest();
            request1.setUser(user1);
            request1.setTitle("Broken Elevator");
            request1.setDescription("Elevator stuck on 3rd floor");
            request1.setPriority("HIGH");
            request1.setStatus("PENDING");
            request1.setRequestDate(LocalDateTime.now());
            maintenanceRepository.save(request1);

            MaintenanceRequest request2 = new MaintenanceRequest();
            request2.setUser(user1);
            request2.setTitle("Leaking Pipe");
            request2.setDescription("Bathroom pipe leaking water");
            request2.setPriority("MEDIUM");
            request2.setStatus("IN_PROGRESS");
            request2.setRequestDate(LocalDateTime.now().minusDays(2));
            maintenanceRepository.save(request2);

            System.out.println("✅ Sample maintenance requests created");
        }

        // Create sample expenses
        if (expenseRepository.count() == 0) {
            Expense expense1 = new Expense();
            expense1.setDescription("Elevator Repair");
            expense1.setAmount(15000.0);
            expense1.setDate(LocalDate.now().minusDays(5));
            expense1.setCategory("Maintenance");
            expenseRepository.save(expense1);

            Expense expense2 = new Expense();
            expense2.setDescription("Electricity Bill");
            expense2.setAmount(8000.0);
            expense2.setDate(LocalDate.now().minusDays(10));
            expense2.setCategory("Utilities");
            expenseRepository.save(expense2);

            Expense expense3 = new Expense();
            expense3.setDescription("Security Guard Salary");
            expense3.setAmount(12000.0);
            expense3.setDate(LocalDate.now().minusDays(1));
            expense3.setCategory("Salary");
            expenseRepository.save(expense3);

            System.out.println("✅ Sample expenses created");
        }

        System.out.println("✅ Database initialized with sample data!");
    }
}
