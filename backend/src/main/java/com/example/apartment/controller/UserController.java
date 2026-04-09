package com.example.apartment.controller;

import com.example.apartment.dto.UserCreateRequest;
import com.example.apartment.model.User;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Username and email are required");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        String defaultPassword = (request.getPassword() == null || request.getPassword().isBlank())
                ? "welcome123"
                : request.getPassword().trim();

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setRole((request.getRole() == null || request.getRole().isBlank()) ? "USER" : request.getRole().trim());
        user.setPassword(passwordEncoder.encode(defaultPassword));
        userRepository.save(user);

        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "User created successfully");
        response.put("username", user.getUsername());
        response.put("defaultPassword", defaultPassword);
        response.put("role", user.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
