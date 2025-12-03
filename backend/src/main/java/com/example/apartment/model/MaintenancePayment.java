package com.example.apartment.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_payments")
@Data
public class MaintenancePayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "payment_month")
    private String month; // Format: "YYYY-MM"

    @Column(name = "payment_amount")
    private Double amount;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @PrePersist
    protected void onCreate() {
        if (isPaid == null) {
            isPaid = false;
        }
    }
}
