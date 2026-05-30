package com.aidenPersonal.avyBuddy.services;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.aidenPersonal.avyBuddy.RouteFiles.RouteComparator;
import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.models.Route;
import com.aidenPersonal.avyBuddy.repositories.RouteRepository;
import com.aidenPersonal.avyBuddy.uacData.Forecast;

import jakarta.transaction.Transactional;

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

    @Transactional
    public List<Route> getRoutesByRecency(String region) {
        return routeRepo.getRoutesByRegion(region, Sort.by(Direction.DESC, "creationTimestamp"));
    }

    @Transactional
    public Optional<List<Route>> getRoutesByForecast(String region) {
        try {
            Forecast forecast = new Forecast(region);
            RouteComparator routeComparator = new RouteComparator(forecast);
            List<Route> returnList = routeRepo.getRoutesByRegion(region, Sort.unsorted());
            Collections.sort(routeRepo.getRoutesByRegion(region, Sort.unsorted()), routeComparator);
            return Optional.of(returnList);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public List<Route> getRoutesByUsername(Account account) {
        return routeRepo.getRoutesByAccountId(account, Sort.by(Direction.DESC, "creationTimestamp"));
    }

    @Transactional
    public boolean addRoute(String name, String description, int positions, String region) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String username = userDetails.getUsername();
        System.out.println(username);
        return true;
        // TODO: Actually add to database here, get User object by username first, then
        // make a route with the constructor, and then actually construct it and save
        // it.
    }
}
