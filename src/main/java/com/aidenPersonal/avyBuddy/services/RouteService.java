package com.aidenPersonal.avyBuddy.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aidenPersonal.avyBuddy.models.Route;
import com.aidenPersonal.avyBuddy.repositories.RouteRepository;

import jakarta.transaction.Transactional;;

@Service
public class RouteService {
    @Autowired
    private RouteRepository routeRepo;

    @Transactional
    public Optional<Route> getRouteById(Integer id) {
        if (routeRepo.existsById(id)) {
            return Optional.of(routeRepo.getReferenceById(id));
        } else {
            return Optional.empty();
        }
    }
}
