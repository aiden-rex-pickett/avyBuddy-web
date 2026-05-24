package com.aidenPersonal.avyBuddy.controllers;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.services.AccountService;

@Controller
public class AccountController {

    @Value("${DOMAIN}:localhost:8080")
    private String domain;

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String username, @RequestParam String password) {
        if (accountService.addAccount(username, password)) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Account with that username already exists");
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

    @GetMapping("/account/{username}")
    public ResponseEntity<?> getAccount(@PathVariable final String username) {
        Optional<Account> account = accountService.getAccountByUsername(username);
        if (account.isEmpty()) {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("Error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
        }
        Map<String, Object> response = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        response.put("creationDate", formatter.format(account.get().getCreation_timestamp()));
        return ResponseEntity.ok(response);
    }
}
