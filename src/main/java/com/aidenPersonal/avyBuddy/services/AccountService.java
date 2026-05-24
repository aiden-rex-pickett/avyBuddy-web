package com.aidenPersonal.avyBuddy.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.repositories.AccountRepository;;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public boolean addAccount(String username, String password) {
        if (!accountRepo.findByUsername(username).isEmpty()){
            return false;
        }
        Account acc = new Account(username, encoder.encode(password));
        accountRepo.save(acc);
        return true;
    }
}
