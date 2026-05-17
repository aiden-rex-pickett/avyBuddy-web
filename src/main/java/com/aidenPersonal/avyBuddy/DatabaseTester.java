package com.aidenPersonal.avyBuddy;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.models.Route;
import com.aidenPersonal.avyBuddy.repositories.AccountRepository;
import com.aidenPersonal.avyBuddy.repositories.RouteRepository;

@Component
public class DatabaseTester implements CommandLineRunner {
    private final AccountRepository userRepo;
    private final RouteRepository routeRepo;

    public DatabaseTester(AccountRepository userRepo, RouteRepository routeRepo) {
        this.userRepo = userRepo;
        this.routeRepo = routeRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        Account user1 = new Account("Aiden", "ARPLING@GMAIL.COM");
        Thread.sleep(30000);
        Account user2 = new Account("ARBLINGUS", "ARPLING@GMAIL.COM");
        userRepo.save(user1);
        userRepo.save(user2);

        List<Account> users = userRepo.findAll();
        for (Account u : users) {
            System.out.println(u);
        }

        Route r = new Route("TEST01", "salt-lake", "This is a description for TEST01", 1234, users.get(0));
        routeRepo.save(r);
    }
}
