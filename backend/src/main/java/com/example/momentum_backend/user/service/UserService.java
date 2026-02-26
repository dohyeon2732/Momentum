package com.example.momentum_backend.user.service;


import com.example.momentum_backend.kuk.entity.Kuk;
import com.example.momentum_backend.kuk.repository.KukRepository;
import com.example.momentum_backend.security.jwt.JwtTokenProvider;
import com.example.momentum_backend.user.dto.*;
import com.example.momentum_backend.user.entity.User;
import com.example.momentum_backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final KukRepository kukRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto save(UserRequestDto dto){

        Kuk kuk = kukRepository.findById(dto.getKukId())
                .orElseThrow(()->new RuntimeException("Kuk not found"));

        User user = User.builder()
                .userName(dto.getUserName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .kuk(kuk)
                .build();

        User saved = userRepository.save(user);
        return UserResponseDto.from(saved);
    }

    public UserResponseDto findById(Long id){
        User user =  userRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        return UserResponseDto.from(user);
    }

    public List<UserResponseDto> findAll(){
        return userRepository.findAll()
                .stream()
                .map(UserResponseDto::from)
                .toList();
    }

    public void delete(Long userId){
        userRepository.deleteById(userId);
    }

    public LoginResponseDto login(LoginRequestDto dto){
        User user = userRepository
                .findByKukKukNameAndUserName(
                        dto.getKukName(),
                        dto.getUserName()
                )
                .orElseThrow(()->new RuntimeException("User not found"));

        if(!passwordEncoder.matches(dto.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid password");
        }


        String token = jwtTokenProvider.createToken(
                user.getUserId(),
                user.getUserName()
        );
    return LoginResponseDto.from(user,token);
    }

    public void changePassword(Long userId, ChangePasswordRequestDto dto){
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("user not found"));

        if(!passwordEncoder.matches(dto.getCurrentPassword(),user.getPassword())){
            throw new RuntimeException("invalid password");
        }



//
//        if(!user.getPassword().equals(dto.getCurrentPassword())){
//            throw new RuntimeException("invalid password");
//        }

        user.changePassword(passwordEncoder.encode(dto.getNewPassword()));

    }

}
