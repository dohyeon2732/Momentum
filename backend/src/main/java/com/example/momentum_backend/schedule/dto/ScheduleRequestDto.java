package com.example.momentum_backend.schedule.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
public class ScheduleRequestDto {

    private String scheduleName;
    private String scheduleDescription;
    private Long roomId;
    private Long userId;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int schedulePeople;
}
