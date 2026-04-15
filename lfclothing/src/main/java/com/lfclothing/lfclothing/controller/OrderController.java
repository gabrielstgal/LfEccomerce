package com.lfclothing.lfclothing.controller;

import com.lfclothing.lfclothing.dto.OrderItemRequest;
import com.lfclothing.lfclothing.dto.OrderRequest;
import com.lfclothing.lfclothing.model.Order;
import com.lfclothing.lfclothing.model.OrderItem;
import com.lfclothing.lfclothing.model.OrderStatus;
import com.lfclothing.lfclothing.model.Product;
import com.lfclothing.lfclothing.model.User;
import com.lfclothing.lfclothing.model.Address;
import com.lfclothing.lfclothing.repository.OrderRepository;
import com.lfclothing.lfclothing.repository.ProductRepository;
import com.lfclothing.lfclothing.repository.UserRepository;
import com.lfclothing.lfclothing.repository.AddressRepository;
import com.lfclothing.lfclothing.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository, AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        if (request.items() == null || request.items().isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho vazio.");
        }

        BigDecimal total = BigDecimal.ZERO;
        Order order = new Order(user, total, OrderStatus.PENDING);

        if (request.street() != null && !request.street().isEmpty()) {
            Address shippingAddress = new Address(user, request.street(), request.number(), request.complement(), request.neighborhood(), request.city(), request.state(), request.zipCode());
            addressRepository.save(shippingAddress);
            order.setShippingAddress(shippingAddress);
        }

        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemReq.productId()));

            // Abatimento de estoque super simples (MVP)
            if (product.getStockAmount() < itemReq.quantity()) {
                return ResponseEntity.badRequest().body("Estoque insuficiente para: " + product.getName());
            }
            product.setStockAmount(product.getStockAmount() - itemReq.quantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(order, product, itemReq.quantity(), product.getPrice(), itemReq.size());
            order.addItem(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));
            total = total.add(itemTotal);
        }

        order.setTotalAmount(total);
        orderRepository.save(order);

        return ResponseEntity.ok("Pedido processado com sucesso!");
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Order> orders = orderRepository.findByUserId(userDetails.getId());
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        // Ordena para que os mais recentes apareçam primeiro no Admin
        return ResponseEntity.ok(orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt")));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido não encontrado."));
        try {
            OrderStatus newStatus = OrderStatus.valueOf(body.get("status"));
            order.setStatus(newStatus);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Status inválido.");
        }
    }
}
