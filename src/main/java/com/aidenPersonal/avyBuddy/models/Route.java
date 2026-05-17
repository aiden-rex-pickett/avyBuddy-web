package com.aidenPersonal.avyBuddy.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Nonnull
    private Integer id;
    @Nonnull
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account_id;
    @Nonnull
    private String name;
    @Nonnull
    private String region;
    @Nonnull
    private String description;
    @Nonnull
    private Integer positions;
    @CreationTimestamp
    @Nonnull
    private LocalDateTime creation_timestamp;

    public Route() {
    }

    public Route(String name, String region, String description, Integer positions) {
        this.name = name;
        this.region = region;
        this.description = description;
        this.positions = positions;
    }

    @Override
    public String toString() {
        return "Route [id=" + id + ", name=" + name + ", region=" + region + "]";
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPositions() {
        return positions;
    }

    public void setPositions(Integer positions) {
        this.positions = positions;
    }

    public LocalDateTime getCreation_timestamp() {
        return creation_timestamp;
    }

    public void setCreation_timestamp(LocalDateTime date_created) {
        this.creation_timestamp = date_created;
    }

}
