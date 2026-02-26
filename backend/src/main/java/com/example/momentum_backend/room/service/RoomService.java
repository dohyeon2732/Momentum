package com.example.momentum_backend.room.service;

import com.example.momentum_backend.room.dto.RoomRequestDto;
import com.example.momentum_backend.room.dto.RoomResponseDto;
import com.example.momentum_backend.room.entity.Room;
import com.example.momentum_backend.room.repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomResponseDto save(RoomRequestDto dto) {
        Room room = Room.builder()
                .roomName(dto.getRoomName())
                .build();

        Room saved = roomRepository.save(room);
        return RoomResponseDto.from(saved);
    }

    public List<RoomResponseDto> findAll() {
        return roomRepository.findAll()
                .stream()
                .map(RoomResponseDto::from)
                .collect(Collectors.toList());
    }

    public RoomResponseDto findById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        return RoomResponseDto.from(room);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }

}
