package com.example.apartment.controller;

import com.example.apartment.model.ChatMessage;
import com.example.apartment.model.User;
import com.example.apartment.repository.ChatRepository;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message, @RequestParam String senderUsername,
            @RequestParam String recipientUsername) {
        Optional<User> sender = userRepository.findByUsername(senderUsername);
        Optional<User> recipient = userRepository.findByUsername(recipientUsername);

        if (sender.isEmpty() || recipient.isEmpty()) {
            return ResponseEntity.badRequest().body("Sender or Recipient not found");
        }

        message.setSender(sender.get());
        message.setRecipient(recipient.get());
        return ResponseEntity.ok(chatRepository.save(message));
    }

    @GetMapping("/history/{user1}/{user2}")
    public ResponseEntity<?> getChatHistory(@PathVariable String user1, @PathVariable String user2) {
        Optional<User> u1 = userRepository.findByUsername(user1);
        Optional<User> u2 = userRepository.findByUsername(user2);

        if (u1.isEmpty() || u2.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<ChatMessage> history = chatRepository.findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
                u1.get(), u2.get(), u1.get(), u2.get());

        return ResponseEntity.ok(history);
    }
}
