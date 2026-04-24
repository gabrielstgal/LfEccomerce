package com.lfclothing.lfclothing.controller;

import com.lfclothing.lfclothing.dto.AbacatePayWebhookPayload;
import com.lfclothing.lfclothing.model.Order;
import com.lfclothing.lfclothing.model.OrderStatus;
import com.lfclothing.lfclothing.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável por receber os webhooks do AbacatePay.
 *
 * Configure a URL de webhook no painel do AbacatePay (app.abacatepay.com):
 *   https://SEU_SERVIDOR/api/payment/webhook
 *
 * Para desenvolvimento local, use ngrok ou similar para expor o localhost.
 * Comando ngrok: ngrok http 8080
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment")
public class WebhookController {

    private final OrderRepository orderRepository;

    public WebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * POST /api/payment/webhook
     *
     * Recebe notificações do AbacatePay sobre eventos de pagamento.
     * Quando o pagamento é concluído (PAYMENT_COMPLETED), atualiza o pedido para PAID.
     * Quando o pagamento falha (PAYMENT_FAILED), atualiza para CANCELED.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody AbacatePayWebhookPayload payload) {
        if (payload == null || payload.data() == null) {
            return ResponseEntity.badRequest().body("Payload inválido.");
        }

        String externalId = payload.data().externalId();
        if (externalId == null || externalId.isBlank()) {
            // Ignorar webhooks sem externalId (eventos de configuração, etc.)
            return ResponseEntity.ok("Ignorado.");
        }

        try {
            Long orderId = Long.parseLong(externalId);
            Order order = orderRepository.findById(orderId).orElse(null);

            if (order == null) {
                return ResponseEntity.ok("Pedido não encontrado, ignorando.");
            }

            switch (payload.event()) {
                case "PAYMENT_COMPLETED", "billing.paid" -> {
                    order.setStatus(OrderStatus.PAID);
                    orderRepository.save(order);
                    System.out.println("[AbacatePay] Pedido #" + orderId + " marcado como PAGO.");
                }
                case "PAYMENT_FAILED", "billing.expired" -> {
                    order.setStatus(OrderStatus.CANCELED);
                    orderRepository.save(order);
                    System.out.println("[AbacatePay] Pedido #" + orderId + " marcado como CANCELADO.");
                }
                default ->
                    System.out.println("[AbacatePay] Evento desconhecido: " + payload.event());
            }

            return ResponseEntity.ok("OK");

        } catch (NumberFormatException e) {
            return ResponseEntity.ok("ExternalId não numérico, ignorando.");
        }
    }
}
