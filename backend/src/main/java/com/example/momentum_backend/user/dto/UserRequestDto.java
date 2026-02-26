package com.example.momentum_backend.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRequestDto {
    private String userName;
    private String password;
    private Long kukId;
}
