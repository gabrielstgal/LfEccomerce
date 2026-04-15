package com.lfclothing.lfclothing.dto;

import java.util.List;

public record JwtResponse(String token, Long id, String name, String email, List<String> roles) {}
