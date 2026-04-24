package com.lfclothing.lfclothing.dto;

import java.util.List;

/**
 * DTO para criar um Checkout no AbacatePay.
 * Referência: https://docs.abacatepay.com/pages/payment/create
 */
public record AbacatePayCheckoutRequest(
    List<CheckoutItem> items,
    String externalId,
    String returnUrl,
    String completionUrl,
    List<String> methods,
    CustomerData customer
) {
    public record CheckoutItem(String externalId, String name, String description, long price, int quantity) {}
    public record CustomerData(String name, String email, String cellphone, String taxId) {}
}
