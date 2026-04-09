package com.example.apartment.dto;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String username;
    private String email;
    private String role;
    private String password;
}
