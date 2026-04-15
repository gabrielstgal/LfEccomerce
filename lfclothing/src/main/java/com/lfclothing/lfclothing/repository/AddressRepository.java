package com.lfclothing.lfclothing.repository;

import com.lfclothing.lfclothing.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
