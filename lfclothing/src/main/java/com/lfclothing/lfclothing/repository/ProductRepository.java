package com.lfclothing.lfclothing.repository;

import com.lfclothing.lfclothing.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryIn(List<String> categories, Pageable pageable);
}
