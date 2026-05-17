package com.aidenPersonal.avyBuddy.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aidenPersonal.avyBuddy.models.Route;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    // TODO: Add methods for maybe getting all routes in list like before
}
