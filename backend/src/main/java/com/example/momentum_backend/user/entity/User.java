package com.example.momentum_backend.user.entity;

import com.example.momentum_backend.kuk.entity.Kuk;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userName;
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kuk_id")
    private Kuk kuk;

    public void changePassword(String newPassword){
        this.password = newPassword;
    }
}

