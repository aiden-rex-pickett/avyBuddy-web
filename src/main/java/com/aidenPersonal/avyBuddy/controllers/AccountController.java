package com.aidenPersonal.avyBuddy.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aidenPersonal.avyBuddy.services.CustomAccountService;

@Controller
public class AccountController {

    @Value("${DOMAIN}:localhost:8080")
    private String domain;

    private final CustomAccountService accountService;

    public AccountController(CustomAccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        accountService.addAccount(username, password);
        return "redirect:http://" + domain;
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkStatus(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) { // Path for missing session cookie
            return ResponseEntity.ok(Map.of(
                    "loggedIn", false,
                    "role", "ANONYMOUS"));
        }
        return ResponseEntity.ok(Map.of(
                "loggedIn", true,
                "username", userDetails.getUsername()));
    }
}
