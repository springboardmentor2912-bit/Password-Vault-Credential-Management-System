package com.passwordvault.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "credentials")
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String website;

    private String username;

    private String password;

    private String notes;

    // Category (Personal, Work, Banking, Social, etc.)
    private String category;

    // Favorite Credential
    private boolean favorite;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Credential() {
    }

    // ==========================
    // ID
    // ==========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // ==========================
    // Website
    // ==========================
    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    // ==========================
    // Username
    // ==========================
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // ==========================
    // Password
    // ==========================
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ==========================
    // Notes
    // ==========================
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // ==========================
    // Category
    // ==========================
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // ==========================
    // Favorite
    // ==========================
    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    // ==========================
    // User
    // ==========================
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}