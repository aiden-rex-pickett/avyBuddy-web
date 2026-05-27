package com.aidenPersonal.avyBuddy;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.aidenPersonal.avyBuddy.repositories.AccountRepository;
import com.aidenPersonal.avyBuddy.repositories.RouteRepository;
import com.aidenPersonal.avyBuddy.models.Account;
import com.aidenPersonal.avyBuddy.models.Route;

@Component
public class DatabaseTester implements CommandLineRunner {
    private final AccountRepository accountRepo;
    private final RouteRepository routeRepo;

    public DatabaseTester(RouteRepository routeRepo, AccountRepository accountRepo) {
        this.routeRepo = routeRepo;
        this.accountRepo = accountRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<Account> user = accountRepo.findById(2);

        if (user.isPresent()) {
            for (int i = 0; i < 24; i++) {
                Route r = new Route("TEST" + i, "salt-lake",
                        "This is a nice description for this test route, it is very fun and cool.", 1 << i, user.get());
                routeRepo.save(r);
                Thread.sleep(200);
            }
        }
    }
}
