package com.aidenPersonal.avyBuddy.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Nonnull
    private Integer id;
    @Nonnull
    @Column(unique = true, nullable = false)
    private String username;
    @Nonnull
    private String passwordHash;
    @CreationTimestamp
    @Nonnull
    private LocalDateTime creation_timestamp;

    public Account() {
    }

    public Account(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public LocalDateTime getCreation_timestamp() {
        return creation_timestamp;
    }

    public void setCreation_timestamp(LocalDateTime creation_date) {
        this.creation_timestamp = creation_date;
    }

    @Override
    public String toString() {
        return "Account [username=" + username + ", passwordHash=" + passwordHash + ", creation_date="
                + creation_timestamp
                + "]";
    }
}
