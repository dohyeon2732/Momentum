package com.example.momentum_backend.room.dto;

import com.example.momentum_backend.room.entity.Room;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomResponseDto {
    private Long roomId;
    private String roomName;

    public static RoomResponseDto from(Room room){
        return RoomResponseDto.builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .build();
    }
}
