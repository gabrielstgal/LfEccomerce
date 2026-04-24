package com.lfclothing.lfclothing.dto;

import java.util.List;

/**
 * DTO para a requisição de criação de pagamento via AbacatePay.
 * Estende o OrderRequest com informações do cliente necessárias para o checkout.
 */
public record PaymentRequest(
        List<OrderItemRequest> items,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String zipCode,
        // Dados do cliente para o checkout AbacatePay
        String customerCpf,
        String customerPhone
) {}
