package com.example.momentum_backend.schedule.controller;


import com.example.momentum_backend.schedule.dto.ScheduleRequestDto;
import com.example.momentum_backend.schedule.dto.ScheduleResponseDto;
import com.example.momentum_backend.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ScheduleResponseDto create(@RequestBody ScheduleRequestDto dto) {
        return scheduleService.save(dto);
    }

    @GetMapping("/{id}")
    public ScheduleResponseDto findByid(@PathVariable Long id) {
        return scheduleService.findById(id);
    }

    @GetMapping
    public List<ScheduleResponseDto> findAll() {
        return scheduleService.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        scheduleService.delete(id);
    }

    @PutMapping("/{id}")
    public ScheduleResponseDto update(@PathVariable Long id, @RequestBody ScheduleRequestDto dto) {
        return scheduleService.update(id,dto);
    }
}
