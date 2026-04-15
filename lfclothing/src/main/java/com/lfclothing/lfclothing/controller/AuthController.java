package com.lfclothing.lfclothing.controller;

import com.lfclothing.lfclothing.dto.JwtResponse;
import com.lfclothing.lfclothing.dto.LoginRequest;
import com.lfclothing.lfclothing.dto.SignupRequest;
import com.lfclothing.lfclothing.model.Role;
import com.lfclothing.lfclothing.model.User;
import com.lfclothing.lfclothing.repository.UserRepository;
import com.lfclothing.lfclothing.security.JwtUtils;
import com.lfclothing.lfclothing.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.email())) {
            return ResponseEntity.badRequest().body("Erro: Email já está em uso!");
        }

        Role userRole = Role.ROLE_USER;
        if (signUpRequest.role() != null && signUpRequest.role().equalsIgnoreCase("admin")) {
            userRole = Role.ROLE_ADMIN;
        }

        User user = new User(signUpRequest.name(), signUpRequest.email(),
                encoder.encode(signUpRequest.password()), userRole);

        userRepository.save(user);

        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }
}
