package com.lfclothing.lfclothing.dto;

import java.util.List;

public record OrderRequest(
        List<OrderItemRequest> items,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String zipCode
) {}
