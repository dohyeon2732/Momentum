package com.example.momentum_backend.kuk.dto;

import com.example.momentum_backend.kuk.entity.Kuk;
import com.example.momentum_backend.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class KukResponseDto {
    private Long kukId;
    private String kukName;

    public static KukResponseDto from(Kuk kuk) {
        return KukResponseDto.builder()
                .kukId(kuk.getKukId())
                .kukName(kuk.getKukName())
                .build();
    }
}
