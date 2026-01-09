package com.musicstream.app.config;

import com.musicstream.app.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // ✅ CORS (VERY IMPORTANT — uses CorsConfigurationSource bean)
            .cors(Customizer.withDefaults())

            // ❌ Disable CSRF for stateless JWT APIs
            .csrf(csrf -> csrf.disable())

            // ❌ No HTTP session (JWT only)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 🔐 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // 🔓 AUTH APIs
                .requestMatchers("/users/login", "/users/register").permitAll()

                // 🔓 SONG READ + STREAM
                .requestMatchers(HttpMethod.GET, "/songs/**").permitAll()

                // 🔐 PLAYLIST APIs
                .requestMatchers("/playlists/**").authenticated()

                // 🔐 EVERYTHING ELSE
                .anyRequest().authenticated()
            )

            // 🔑 JWT FILTER
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔐 PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
