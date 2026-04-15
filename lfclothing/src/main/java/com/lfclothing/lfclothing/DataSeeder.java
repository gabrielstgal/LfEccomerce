package com.lfclothing.lfclothing;

import com.lfclothing.lfclothing.model.Product;
import com.lfclothing.lfclothing.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initProducts(ProductRepository repository) {
        return args -> {
            boolean jaTemOriginais = repository.findAll().stream()
                    .anyMatch(p -> p.getName().contains("Camiseta Classic Areia"));

            if (!jaTemOriginais) {
                Product p1 = new Product("Camiseta Classic Areia", "Camiseta com caimento perfeito, desenvolvida em algodão premium com toque super macio. Ideal para o dia a dia e composições minimalistas. Logo LF discreto no peito.", "Camisetas", new BigDecimal("89.90"), "/img/camiseta-bege.jpeg", 100);
                p1.setSizes(Arrays.asList("P", "M", "G", "GG"));

                Product p2 = new Product("Jaqueta Bomber Azul Marinho", "Jaqueta leve e versátil com fechamento em zíper frontal. Ideal para meia-estação, contando com acabamento impecável, bolsos laterais e punhos ajustados para não entrar frio.", "Jaquetas", new BigDecimal("249.90"), "/img/jaqueta-azul.jpeg", 50);
                p2.setSizes(Arrays.asList("P", "M", "G"));

                Product p3 = new Product("Jaqueta Bomber Premium Areia", "Elevando o look casual, esta jaqueta na cor areia garante proteção térmica sem perder o toque moderno. Confeccionada em tecido tecnológico resistente a ventos.", "Jaquetas", new BigDecimal("249.90"), "/img/jaqueta-bege.jpeg", 30);
                p3.setSizes(Arrays.asList("M", "G", "GG"));

                Product p4 = new Product("Jaqueta Bomber Clássica Preta", "A clássica preta infalível. Curinga no guarda-roupa masculino, muito confortável tanto aberta sobre camisetas brancas, quanto fechada para dias gelados.", "Jaquetas", new BigDecimal("249.90"), "/img/jaqueta-preta.jpeg", 70);
                p4.setSizes(Arrays.asList("P", "M", "G", "GG"));

                repository.saveAll(Arrays.asList(p1, p2, p3, p4));
                System.out.println("🛍️ Coleção Original LF inserida com sucesso no banco vazio!");
            }
        };
    }
}
