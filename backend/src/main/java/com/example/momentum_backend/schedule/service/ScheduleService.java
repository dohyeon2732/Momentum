package com.example.momentum_backend.schedule.service;

import com.example.momentum_backend.kuk.entity.Kuk;
import com.example.momentum_backend.kuk.repository.KukRepository;
import com.example.momentum_backend.room.entity.Room;
import com.example.momentum_backend.room.repository.RoomRepository;
import com.example.momentum_backend.schedule.dto.ScheduleRequestDto;
import com.example.momentum_backend.schedule.dto.ScheduleResponseDto;
import com.example.momentum_backend.schedule.entity.Schedule;
import com.example.momentum_backend.schedule.repository.ScheduleRepository;
import com.example.momentum_backend.user.entity.User;
import com.example.momentum_backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final KukRepository kukRepository;

    public ScheduleResponseDto save(ScheduleRequestDto dto){
        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(()->new RuntimeException("Room not found"));

        User user = userRepository.findById(dto.getUserId()).orElseThrow(()->new RuntimeException("User not found"));

        Kuk kuk = user.getKuk();
        if(kuk==null){
            throw new RuntimeException("user has no kuk");
        }

        boolean exists = scheduleRepository.existsOverlappingSchedule(dto.getRoomId(),dto.getScheduleDate(),dto.getStartTime(),dto.getEndTime());

        if(exists){
            throw new RuntimeException("시간 중복 발생");
        }


        Schedule schedule = Schedule.builder()
                .scheduleName(dto.getScheduleName())
                .scheduleDescription(dto.getScheduleDescription())
                .room(room)
                .user(user)
                .kuk(kuk)
                .scheduleDate(dto.getScheduleDate())
                .scheduleStartTime(dto.getStartTime())
                .scheduleEndTime(dto.getEndTime())
                .schedulePeople(dto.getSchedulePeople())
                .build();

        Schedule saved = scheduleRepository.save(schedule);
        return ScheduleResponseDto.from(saved);

    }

    public ScheduleResponseDto findById(Long id){
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(()->new RuntimeException("Schedule not found"));
        return ScheduleResponseDto.from(schedule);

    }

    public List<ScheduleResponseDto> findAll(){
        return scheduleRepository.findAllByOrderByScheduleDateAsc()
                .stream().map(ScheduleResponseDto::from).collect(Collectors.toList());
    }

    public void delete(Long id){
        scheduleRepository.deleteById(id);
    }

    public ScheduleResponseDto update(Long id, ScheduleRequestDto dto){
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(()->new RuntimeException("Schedule not found"));
        Room room = roomRepository.findById(dto.getRoomId()).orElseThrow(()->new RuntimeException("Room not found"));
        User user = userRepository.findById(dto.getUserId()).orElseThrow(()->new RuntimeException("User not found"));
        Kuk kuk = user.getKuk();
        if(kuk==null){
            throw new RuntimeException("user has no kuk");
        }

        LocalTime startTime = dto.getStartTime();
        LocalTime endTime = dto.getEndTime();

        if(endTime.equals(LocalTime.MIDNIGHT)&& startTime.isAfter(endTime)){
            endTime=LocalTime.MAX;
        }

        boolean exists = scheduleRepository.existsOverlappingScheduleExceptSelf(
                dto.getRoomId(),
                dto.getScheduleDate(),
                startTime,
                endTime,
                id
        );

        if(exists){
            throw new RuntimeException("schedule already exists");
        }

        schedule.setScheduleName(dto.getScheduleName());
        schedule.setScheduleDescription(dto.getScheduleDescription());
        schedule.setRoom(room);
        schedule.setUser(user);
        schedule.setKuk(kuk);
        schedule.setScheduleDate(dto.getScheduleDate());
        schedule.setScheduleStartTime(startTime);
        schedule.setScheduleEndTime(endTime);
        schedule.setSchedulePeople(dto.getSchedulePeople());

        return ScheduleResponseDto.from(schedule);
    }

    public List<ScheduleResponseDto> findByRoom(Long roomId){

        List<Schedule> schedules =
                scheduleRepository.findByRoomRoomId(roomId);

        return schedules.stream()
                .map(ScheduleResponseDto::from)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponseDto> findByRoomAndDate(Long roomId, LocalDate scheduleDate){
        List<Schedule> schedules=
                scheduleRepository.findByRoomRoomIdAndScheduleDate(roomId,scheduleDate);

        return schedules.stream().map(ScheduleResponseDto::from).toList();
    }

    public List<ScheduleResponseDto> findUpcomingSchedule(Long userId){
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        return scheduleRepository.findByUserUserIdOrderByScheduleDateAscScheduleStartTimeAsc(userId)
                .stream()
                .filter(schedule -> schedule.getStartDateTime().isAfter(now))
                .map(ScheduleResponseDto::from)
                .toList();
    }

    public List<ScheduleResponseDto> findPastSchedule(Long userId){
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        return scheduleRepository.findByUserUserIdOrderByScheduleDateDescScheduleStartTimeDesc(userId)
                .stream()
                .filter(schedule -> schedule.getStartDateTime().isBefore(now))
                .map(ScheduleResponseDto::from)
                .toList();
    }

}
