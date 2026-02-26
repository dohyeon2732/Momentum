package com.example.momentum_backend.user.controller;

import com.example.momentum_backend.kuk.dto.KukResponseDto;
import com.example.momentum_backend.schedule.dto.ScheduleResponseDto;
import com.example.momentum_backend.schedule.service.ScheduleService;
import com.example.momentum_backend.user.dto.*;
import com.example.momentum_backend.user.repository.UserRepository;
import com.example.momentum_backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final ScheduleService scheduleService;
    private final UserRepository userRepository;


    @PostMapping
    public UserResponseDto create(@RequestBody UserRequestDto dto) {
        return userService.save(dto);
    }

    @GetMapping("/id/{id}")
    public UserResponseDto findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping
    public List<UserResponseDto> findAll() {
        return userService.findAll();
    }

    @DeleteMapping("/id/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/{userId}/schedule/upcoming")
    public List<ScheduleResponseDto> findScheduleUpcoming(@PathVariable Long userId){
        return scheduleService.findUpcomingSchedule(userId);
    }

    @GetMapping("/{userId}/schedule/past")
    public List<ScheduleResponseDto> findSchedulePast(@PathVariable Long userId){
        return scheduleService.findPastSchedule(userId);
    }

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody LoginRequestDto dto) {
        return userService.login(dto);
    }

    @GetMapping("/me")
    public UserResponseDto me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");

        if(userId == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userService.findById(userId);
    }

    @GetMapping("/kuk/{kukId}")
    public List<UserResponseDto> findByKukId(@PathVariable Long kukId){
        return userRepository.findByKuk_KukId(kukId)
                .stream()
                .map(UserResponseDto::from)
                .toList();
    }

    @PostMapping("/password")
    public void changePassword(HttpServletRequest request,@RequestBody ChangePasswordRequestDto dto){
        Long userId = (Long) request.getAttribute("userId");
        if(userId ==null)
        {
            throw new RuntimeException("Unauthorized");
        }
        userService.changePassword(userId,dto);
    }
}
