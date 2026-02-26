package com.example.momentum_backend.kuk.service;

import com.example.momentum_backend.kuk.dto.KukRequestDto;
import com.example.momentum_backend.kuk.dto.KukResponseDto;
import com.example.momentum_backend.kuk.entity.Kuk;
import com.example.momentum_backend.kuk.repository.KukRepository;
import com.example.momentum_backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class KukService {
    private final KukRepository kukRepository;

    public KukResponseDto save(KukRequestDto dto) {
        Kuk kuk = Kuk.builder()
                .kukName(dto.getKukName())
                .build();

        Kuk saved = kukRepository.save(kuk);
        return KukResponseDto.from(saved);
    }

    public KukResponseDto findById(Long id){
        Kuk kuk = kukRepository.findById(id).orElseThrow(()->new RuntimeException("Kuk not found"));
        return KukResponseDto.from(kuk);
    }


    public List<KukResponseDto> findAll(){
        return kukRepository.findAll()
                .stream()
                .map(KukResponseDto::from)
                .toList();
    }

    public void delete(Long kukId){
        kukRepository.deleteById(kukId);
    }
}
