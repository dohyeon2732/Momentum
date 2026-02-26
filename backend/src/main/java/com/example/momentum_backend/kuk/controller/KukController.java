package com.example.momentum_backend.kuk.controller;

import com.example.momentum_backend.kuk.dto.KukRequestDto;
import com.example.momentum_backend.kuk.dto.KukResponseDto;
import com.example.momentum_backend.kuk.service.KukService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kuk")
public class KukController {
    private final KukService kukService;

    @PostMapping
    public KukResponseDto create(@RequestBody KukRequestDto dto) {
        return  kukService.save(dto);
    }

    @GetMapping("/{id}")
    public KukResponseDto findById(@PathVariable Long id) {
        return kukService.findById(id);
    }

    @GetMapping
    public List<KukResponseDto> findAll() {
        return kukService.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        kukService.delete(id);
    }
}
