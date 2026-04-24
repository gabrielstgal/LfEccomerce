package com.lfclothing.lfclothing.dto;

/**
 * DTO para o webhook recebido do AbacatePay quando um pagamento é concluído.
 * O campo `event` pode ser "PAYMENT_COMPLETED", "PAYMENT_FAILED", etc.
 */
public record AbacatePayWebhookPayload(
    String event,
    PaymentData data
) {
    public record PaymentData(
        String id,
        String externalId,
        String status,
        long amount,
        long paidAmount,
        String customerId
    ) {}
}
