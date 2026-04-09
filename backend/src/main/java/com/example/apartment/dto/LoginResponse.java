package com.example.apartment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String username;
    private String email;
    private String role;
    private String message;
    private String token; // JWT token
    
    public LoginResponse(String username, String email, String role, String message) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.message = message;
    }
}
