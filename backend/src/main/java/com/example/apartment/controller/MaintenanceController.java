package com.example.apartment.controller;

import com.example.apartment.dto.StatusUpdateRequest;
import com.example.apartment.model.MaintenanceRequest;
import com.example.apartment.model.User;
import com.example.apartment.repository.MaintenanceRepository;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody MaintenanceRequest request, @RequestParam String username,
            Authentication authentication) {
        String loggedInUser = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !loggedInUser.equals(username)) {
            return ResponseEntity.status(403).body("You can only create requests for your own account");
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        request.setUser(user.get());
        return ResponseEntity.ok(maintenanceRepository.save(request));
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequest>> getAllRequests() {
        return ResponseEntity.ok(maintenanceRepository.findAll());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserRequests(@PathVariable String username, Authentication authentication) {
        String loggedInUser = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !loggedInUser.equals(username)) {
            return ResponseEntity.status(403).body("You can only view your own requests");
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(maintenanceRepository.findByUser(user.get()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest statusUpdate) {
        Optional<MaintenanceRequest> maintenanceRequestOptional = maintenanceRepository.findById(id);
        if (maintenanceRequestOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }

        if (statusUpdate.getStatus() == null || statusUpdate.getStatus().isBlank()) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        MaintenanceRequest maintenanceRequest = maintenanceRequestOptional.get();
        maintenanceRequest.setStatus(statusUpdate.getStatus().trim());
        if ("COMPLETED".equalsIgnoreCase(statusUpdate.getStatus().trim())) {
            maintenanceRequest.setCompletionDate(LocalDateTime.now());
        } else {
            maintenanceRequest.setCompletionDate(null);
        }
        return ResponseEntity.ok(maintenanceRepository.save(maintenanceRequest));
    }
}
