package com.aidenPersonal.avyBuddy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aidenPersonal.avyBuddy.models.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    // TODO: Add methods for maybe getting all routes for a certain user?
}
