package com.aidenPersonal.avyBuddy.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.models.Route;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    // TODO: Add methods for maybe getting all routes in list like before
    public List<Route> getRoutesByRegion(String region, Sort s);

    public List<Route> getRoutesByAccountId(Account account, Sort s);
}
