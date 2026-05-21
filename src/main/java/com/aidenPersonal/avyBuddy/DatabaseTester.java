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
        Thread.sleep(3000);
        userRepo.save(user1);
        Route r = new Route("TEST01", "salt-lake", "This is a description for TEST01", 1234, user1);
        routeRepo.save(r);


        Account user2 = new Account("ARBLINGUS", "YABADABA");
        userRepo.save(user2);
        r = new Route("TEST02", "salt-lake", "This is a description for TEST02", 2345, user2);
        routeRepo.save(r);
        Thread.sleep(4000);
        r = new Route("TEST03", "skyline", "This is a description for TEST03", 3456, user2);
        routeRepo.save(r);

        r = new Route("TEST04", "ogden", "This is a description for TEST04", 4567, user1);

        List<Account> users = userRepo.findAll();
        for (Account u : users) {
            System.out.println(u);
        }
    }
}
