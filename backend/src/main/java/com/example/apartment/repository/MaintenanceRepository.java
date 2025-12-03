package com.example.apartment.repository;

import com.example.apartment.model.MaintenanceRequest;
import com.example.apartment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByUser(User user);

    List<MaintenanceRequest> findByStatus(String status);
}
