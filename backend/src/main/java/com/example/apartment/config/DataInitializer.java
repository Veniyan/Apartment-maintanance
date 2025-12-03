package com.example.apartment.config;

import com.example.apartment.model.User;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

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

        System.out.println("✅ Database initialized with default users only (No sample data).");
    }
}
