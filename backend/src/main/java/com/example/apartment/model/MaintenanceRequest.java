package com.example.apartment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Data
public class MaintenanceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status; // PENDING, IN_PROGRESS, COMPLETED
    private String priority; // LOW, MEDIUM, HIGH

    private LocalDateTime requestDate;
    private LocalDateTime completionDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        requestDate = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
}
