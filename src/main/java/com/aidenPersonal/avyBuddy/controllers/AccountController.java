package com.aidenPersonal.avyBuddy.controllers;

import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {

    private final String dburl = "jdbc:sqlite:C:/Users/ka7nq/webProjects/avyBuddy/src/main/resources/database.db";
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public void register(@RequestParam String username, @RequestParam String password) {

        password = encoder.encode(password);

        try {
            var connection = DriverManager.getConnection(dburl);
            var statement = connection.createStatement();

            String sql = "INSERT INTO accounts (username, password) VALUES ('" + username + "', '" + password + "');";

            statement.execute(sql);
            connection.close();
            statement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
