package com.example.momentum_backend.room.repository;

import com.example.momentum_backend.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room,Long> {

}
