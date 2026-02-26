package com.example.momentum_backend.room.controller;


import com.example.momentum_backend.room.dto.RoomRequestDto;
import com.example.momentum_backend.room.dto.RoomResponseDto;
import com.example.momentum_backend.room.service.RoomService;
import com.example.momentum_backend.schedule.dto.ScheduleResponseDto;
import com.example.momentum_backend.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/room")
public class RoomController {
    private final RoomService roomService ;
    private final ScheduleService scheduleService;


    @PostMapping
    public RoomResponseDto create(@RequestBody RoomRequestDto dto) {
        return roomService.save(dto);
    }

    @GetMapping("/{id}")
    public RoomResponseDto findById(@PathVariable Long id) {
        return roomService.findById(id);
    }

    @GetMapping
    public List<RoomResponseDto> findAll() {
        return roomService.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomService.delete(id);
    }

    @GetMapping("/{roomId}/schedule/room") //딱히 필요 없긴함.
    public List<ScheduleResponseDto> getSchedule(@PathVariable Long roomId) {
        return scheduleService.findByRoom(roomId);
    }

    @GetMapping("/{roomId}/schedule/date")
    public List<ScheduleResponseDto> getScheduleByDate(@PathVariable Long roomId, @RequestParam LocalDate scheduleDate) {
        return scheduleService.findByRoomAndDate(roomId, scheduleDate);
    }

}
