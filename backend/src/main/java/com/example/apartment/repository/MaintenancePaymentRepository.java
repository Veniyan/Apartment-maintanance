package com.example.apartment.repository;

import com.example.apartment.model.MaintenancePayment;
import com.example.apartment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MaintenancePaymentRepository extends JpaRepository<MaintenancePayment, Long> {
    List<MaintenancePayment> findByMonth(String month);

    List<MaintenancePayment> findByUserAndMonth(User user, String month);

    List<MaintenancePayment> findByUser(User user);
}
