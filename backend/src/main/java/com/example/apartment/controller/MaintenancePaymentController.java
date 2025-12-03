package com.example.apartment.controller;

import com.example.apartment.model.MaintenancePayment;
import com.example.apartment.model.User;
import com.example.apartment.repository.MaintenancePaymentRepository;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class MaintenancePaymentController {

    @Autowired
    private MaintenancePaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<MaintenancePayment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/month/{month}")
    public ResponseEntity<List<MaintenancePayment>> getPaymentsByMonth(@PathVariable String month) {
        return ResponseEntity.ok(paymentRepository.findByMonth(month));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<MaintenancePayment>> getPaymentsByUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paymentRepository.findByUser(user));
    }

    @GetMapping("/user/{username}/month/{month}")
    public ResponseEntity<List<MaintenancePayment>> getPaymentsByUserAndMonth(@PathVariable String username,
            @PathVariable String month) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paymentRepository.findByUserAndMonth(user, month));
    }

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody MaintenancePayment payment, @RequestParam String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        try {
            payment.setUser(user);
            return ResponseEntity.ok(paymentRepository.save(payment));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating payment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id,
            @RequestBody MaintenancePayment updatedPayment) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Payment ID is required");
        }
        MaintenancePayment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        payment.setIsPaid(updatedPayment.getIsPaid());
        payment.setPaymentDate(updatedPayment.getPaymentDate());
        return ResponseEntity.ok(paymentRepository.save(payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body("Payment ID is required");
        }
        MaintenancePayment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        paymentRepository.delete(payment);
        return ResponseEntity.ok().body("Payment deleted successfully");
    }
}
