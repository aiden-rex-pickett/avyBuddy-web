package com.aidenPersonal.avyBuddy;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.aidenPersonal.avyBuddy.repositories.UserRepository;
import com.aidenPersonal.avyBuddy.entities.User;

@Component
public class DatabaseTester implements CommandLineRunner {
    private final UserRepository userRepo;

    public DatabaseTester(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        User user = new User("Aiden", "ARPLING@GMAIL.COM");
        userRepo.save(user);

        List<User> users = userRepo.findAll();
        for (User u : users) {
            System.out.println(u);
        }
    }
}
