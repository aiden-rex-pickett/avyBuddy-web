package com.aidenPersonal.avyBuddy.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aidenPersonal.avyBuddy.models.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    public Optional<Account> findByUsername(String username);
}
