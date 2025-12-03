package com.example.apartment.controller;

import com.example.apartment.model.MaintenanceRequest;
import com.example.apartment.model.User;
import com.example.apartment.repository.MaintenanceRepository;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> createRequest(@RequestBody MaintenanceRequest request, @RequestParam String username) {
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
    public ResponseEntity<?> getUserRequests(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(maintenanceRepository.findByUser(user.get()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        Optional<MaintenanceRequest> request = maintenanceRepository.findById(id);
        if (request.isEmpty()) {
            return ResponseEntity.badRequest().body("Request not found");
        }
        MaintenanceRequest maintenanceRequest = request.get();
        maintenanceRequest.setStatus(status);
        return ResponseEntity.ok(maintenanceRepository.save(maintenanceRequest));
    }
}
