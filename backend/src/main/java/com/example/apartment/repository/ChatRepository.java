package com.example.apartment.repository;

import com.example.apartment.model.ChatMessage;
import com.example.apartment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
            User sender1, User recipient1, User recipient2, User sender2);
}
