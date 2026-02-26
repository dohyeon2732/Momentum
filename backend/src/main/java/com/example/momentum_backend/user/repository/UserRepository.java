package com.example.momentum_backend.user.repository;

import com.example.momentum_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByKuk_KukId(Long kukId);

    Optional<User>findByKukKukNameAndUserName(String kukName, String userName);

}
