package com.aidenPersonal.avyBuddy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aidenPersonal.avyBuddy.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
