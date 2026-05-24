package com.aidenPersonal.avyBuddy.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aidenPersonal.avyBuddy.services.AccountService;

@Controller
public class AccountController {

    @Value("${DOMAIN}")
    private String domain;

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        accountService.addAccount(username, password);
        return "redirect:http://" + domain;
    }
}
