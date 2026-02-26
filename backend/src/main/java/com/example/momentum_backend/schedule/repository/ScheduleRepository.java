package com.example.momentum_backend.schedule.repository;

import com.example.momentum_backend.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,Long> {
    List<Schedule> findByRoomRoomId(Long roomId);
    List<Schedule> findByRoomRoomIdAndScheduleDate(Long roomId, LocalDate scheduleDate);

    List<Schedule> findByUserUserId(Long userId);

    boolean existsByRoomRoomIdAndScheduleDateAndScheduleStartTimeLessThanAndScheduleEndTimeGreaterThan(
            Long roomId,
            LocalDate scheduleDate,
            LocalTime startTime,
            LocalTime endTime
    );

    boolean existsByRoomRoomIdAndScheduleDateAndScheduleStartTimeLessThanAndScheduleEndTimeGreaterThanAndScheduleIdNot(
    Long roomId,
    LocalDate scheduleDate,
    LocalTime startTime,
    LocalTime endTime,
    Long scheduleId);


    @Query("""
select count(s) > 0
from Schedule s
where s.room.roomId = :roomId
  and s.scheduleDate = :scheduleDate
  and s.scheduleStartTime < :endTime
  and s.scheduleEndTime > :startTime
  and s.scheduleId <> :scheduleId
""")
    boolean existsOverlappingScheduleExceptSelf(
            @Param("roomId") Long roomId,
            @Param("scheduleDate") LocalDate scheduleDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("scheduleId") Long scheduleId
    );



    @Query("""
select count(s) > 0
from Schedule s
where s.room.roomId = :roomId
  and s.scheduleDate = :scheduleDate
  and s.scheduleStartTime < :endTime
  and s.scheduleEndTime > :startTime
""")
    boolean existsOverlappingSchedule(
            @Param("roomId") Long roomId,
            @Param("scheduleDate") LocalDate scheduleDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );


    List<Schedule> findAllByOrderByScheduleDateAsc();
    List<Schedule> findByUserUserIdOrderByScheduleDateAscScheduleStartTimeAsc(
            Long userId);
    List<Schedule> findByUserUserIdOrderByScheduleDateDescScheduleStartTimeDesc(Long userId);

}
