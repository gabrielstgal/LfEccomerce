package com.lfclothing.lfclothing.controller;

import com.lfclothing.lfclothing.dto.OrderItemRequest;
import com.lfclothing.lfclothing.dto.PaymentRequest;
import com.lfclothing.lfclothing.model.*;
import com.lfclothing.lfclothing.repository.AddressRepository;
import com.lfclothing.lfclothing.repository.OrderRepository;
import com.lfclothing.lfclothing.repository.ProductRepository;
import com.lfclothing.lfclothing.repository.UserRepository;
import com.lfclothing.lfclothing.security.UserDetailsImpl;
import com.lfclothing.lfclothing.service.AbacatePayService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Controller responsável pelo fluxo de pagamento via AbacatePay.
 * Cria o pedido no banco, chama a API do AbacatePay e retorna a URL de pagamento.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final AbacatePayService abacatePayService;

    public PaymentController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            AbacatePayService abacatePayService
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.abacatePayService = abacatePayService;
    }

    /**
     * POST /api/payment/create-checkout
     *
     * 1. Valida o carrinho
     * 2. Salva o pedido com status PENDING
     * 3. Chama o AbacatePay para criar um checkout (Pix + Cartão)
     * 4. Retorna a URL de pagamento para o frontend redirecionar o usuário
     */
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/create-checkout")
    public ResponseEntity<?> createCheckout(
            @RequestBody PaymentRequest request,
            Authentication authentication
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        if (request.items() == null || request.items().isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho vazio.");
        }

        // 1. Monta e salva o pedido
        BigDecimal total = BigDecimal.ZERO;
        Order order = new Order(user, total, OrderStatus.PENDING);

        if (request.street() != null && !request.street().isEmpty()) {
            Address shippingAddress = new Address(
                    user,
                    request.street(),
                    request.number(),
                    request.complement(),
                    request.neighborhood(),
                    request.city(),
                    request.state(),
                    request.zipCode()
            );
            addressRepository.save(shippingAddress);
            order.setShippingAddress(shippingAddress);
        }

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemReq.productId()));

            if (product.getStockAmount() < itemReq.quantity()) {
                return ResponseEntity.badRequest()
                        .body("Estoque insuficiente para: " + product.getName());
            }

            product.setStockAmount(product.getStockAmount() - itemReq.quantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(order, product, itemReq.quantity(), product.getPrice(), itemReq.size());
            order.addItem(orderItem);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // 2. Cria o checkout no AbacatePay
        try {
            String cpf = request.customerCpf() != null ? request.customerCpf().replaceAll("\\D", "") : "";
            String phone = request.customerPhone() != null ? request.customerPhone().replaceAll("\\D", "") : "";

            String paymentUrl = abacatePayService.createCheckout(
                    total,
                    String.valueOf(savedOrder.getId()),
                    user.getName(),
                    user.getEmail(),
                    cpf,
                    phone
            );

            return ResponseEntity.ok(Map.of(
                    "paymentUrl", paymentUrl,
                    "orderId", savedOrder.getId()
            ));

        } catch (Exception e) {
            // Em caso de falha no AbacatePay, cancela o pedido
            savedOrder.setStatus(OrderStatus.CANCELED);
            orderRepository.save(savedOrder);
            return ResponseEntity.status(502)
                    .body("Erro ao processar pagamento: " + e.getMessage());
        }
    }
}
