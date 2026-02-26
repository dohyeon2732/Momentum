package com.example.momentum_backend.user.dto;

import com.example.momentum_backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {
    private Long userId;
    private String userName;
    private Long kukId;
    private String kukName;

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .kukId(user.getKuk().getKukId())
                .kukName(user.getKuk().getKukName())
                .build();
    }
}
