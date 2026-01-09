package com.musicstream.app.controller;

import com.musicstream.app.dto.LoginRequest;
import com.musicstream.app.dto.RegisterRequest;
import com.musicstream.app.model.User;
import com.musicstream.app.security.JwtUtil;
import com.musicstream.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /* =========================
       REGISTER
    ========================= */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = userService.register(
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message", "Registration successful",
                        "email", user.getEmail()
                )
        );
    }

    /* =========================
       LOGIN
    ========================= */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService.authenticate(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "email", user.getEmail()
                )
        );
    }
}
