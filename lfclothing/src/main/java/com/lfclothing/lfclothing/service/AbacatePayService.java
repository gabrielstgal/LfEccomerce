package com.lfclothing.lfclothing.service;

import com.lfclothing.lfclothing.dto.AbacatePayCheckoutRequest;
import com.lfclothing.lfclothing.dto.AbacatePayCheckoutResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço responsável por toda comunicação com a API REST do AbacatePay.
 * Documentação: https://docs.abacatepay.com/pages/payment/create
 *
 * IMPORTANTE: Configure abacatepay.api.key no application.properties
 * com sua chave obtida em https://app.abacatepay.com
 */
@Service
public class AbacatePayService {

    private final WebClient webClient;

    @Value("${abacatepay.api.key}")
    private String apiKey;

    @Value("${app.base.url}")
    private String appBaseUrl;

    public AbacatePayService(@Value("${abacatepay.api.url}") String apiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Cria um Checkout no AbacatePay com Pix e Cartão habilitados.
     *
     * @param total         valor total do pedido em BigDecimal (ex: 129.90)
     * @param externalId    ID do pedido no nosso sistema (ex: "order-42")
     * @param customerName  nome do cliente
     * @param customerEmail e-mail do cliente
     * @param customerCpf   CPF do cliente (somente números)
     * @param customerPhone telefone do cliente (ex: "11999999999")
     * @return URL de pagamento para redirecionar o usuário
     */
    public String createCheckout(
            BigDecimal total,
            String externalId,
            String customerName,
            String customerEmail,
            String customerCpf,
            String customerPhone
    ) {
        // AbacatePay trabalha com valores em centavos (inteiro)
        long amountInCents = total.multiply(BigDecimal.valueOf(100)).longValue();

        AbacatePayCheckoutRequest request = new AbacatePayCheckoutRequest(
                List.of(new AbacatePayCheckoutRequest.CheckoutItem(
                        externalId,
                        "Pedido LF Clothing #" + externalId,
                        "Compra na LF Clothing",
                        amountInCents,
                        1
                )),
                externalId,
                appBaseUrl + "/pagamento/cancelado",
                appBaseUrl + "/pagamento/sucesso?orderId=" + externalId,
                List.of("PIX", "CREDIT_CARD"),
                new AbacatePayCheckoutRequest.CustomerData(
                        customerName,
                        customerEmail,
                        customerPhone,
                        customerCpf
                )
        );

        AbacatePayCheckoutResponse response = webClient.post()
                .uri("/v1/billing/create")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(AbacatePayCheckoutResponse.class)
                .block();

        if (response == null || !response.success() || response.data() == null) {
            throw new RuntimeException("Falha ao criar checkout no AbacatePay: " +
                    (response != null ? response.error() : "resposta nula"));
        }

        return response.data().url();
    }
}
