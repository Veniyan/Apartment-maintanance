package com.example.apartment.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String username;
    private String oldPassword;
    private String newPassword;
}
