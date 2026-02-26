package com.example.momentum_backend.user.dto;

import com.example.momentum_backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {
    private Long userId;
    private String kukName;
    private String userName;
    private String accessToken;

    public static LoginResponseDto from(User user, String accessToken) {
        return LoginResponseDto.builder()
                .userId(user.getUserId())
                .kukName(user.getKuk().getKukName())
                .userName(user.getUserName())
                .accessToken(accessToken)
                .build();

    }
}
