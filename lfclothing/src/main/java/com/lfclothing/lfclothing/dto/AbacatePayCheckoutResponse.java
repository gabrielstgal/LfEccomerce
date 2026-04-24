package com.lfclothing.lfclothing.dto;

/**
 * DTO para resposta de criação de checkout do AbacatePay.
 * O campo mais importante é `data.url`, para onde o usuário é redirecionado.
 */
public record AbacatePayCheckoutResponse(
        CheckoutData data,
        boolean success,
        String error) {
    public record CheckoutData(
            String id,
            String externalId,
            String url,
            long amount,
            String status,
            String frequency) {
    }
}
