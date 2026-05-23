package com.aidenPersonal.avyBuddy.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aidenPersonal.avyBuddy.services.AccountService;

@Controller
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        accountService.addAccount(username, password);
        // TODO: Change this to using environment variable,
        // so here it can be localhost and later it can be a domain name
        return "redirect:http://localhost";
    }
}
