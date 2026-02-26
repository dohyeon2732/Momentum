package com.example.momentum_backend.schedule.dto;

import com.example.momentum_backend.schedule.entity.Schedule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;


@Getter
@Builder
public class ScheduleResponseDto {
    private Long scheduleId;
    private String scheduleName;
    private Long roomId;
    private String roomName;
    private Long userId;
    private Long kukId;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer schedulePeople;

    private boolean success;
    private String code;
    private String message;

    public static ScheduleResponseDto from(Schedule schedule) {
        return ScheduleResponseDto.builder()
                .scheduleId(schedule.getScheduleId())
                .scheduleName(schedule.getScheduleName())
                .roomId(schedule.getRoom().getRoomId())
                .roomName(schedule.getRoom().getRoomName())
                .userId(schedule.getUser().getUserId())
                .kukId(schedule.getKuk()!=null ? schedule.getKuk().getKukId():null)
                .scheduleDate(schedule.getScheduleDate())
                .startTime(schedule.getScheduleStartTime())
                .endTime(schedule.getScheduleEndTime())
                .schedulePeople(schedule.getSchedulePeople())
                .build();
    }

    public static ScheduleResponseDto success(Long scheduleId) {
        return ScheduleResponseDto.builder()
                .success(true)
                .code("success")
                .message("요청이 처리되었음.")
                .build();
    }
}
