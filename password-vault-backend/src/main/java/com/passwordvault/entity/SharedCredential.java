package com.passwordvault.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shared_credentials")
public class SharedCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Credential being shared
    @ManyToOne
    @JoinColumn(name = "credential_id", nullable = false)
    private Credential credential;

    // User who owns the credential
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // User who receives access
    @ManyToOne
    @JoinColumn(name = "shared_with_id", nullable = false)
    private User sharedWith;

    // VIEW_ONLY, EDIT, FULL_MANAGEMENT
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Permission permission;

    private LocalDateTime createdAt;

    public SharedCredential() {
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
    // Credential
    // ==========================

    public Credential getCredential() {
        return credential;
    }

    public void setCredential(Credential credential) {
        this.credential = credential;
    }

    // ==========================
    // Owner
    // ==========================

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    // ==========================
    // Shared With
    // ==========================

    public User getSharedWith() {
        return sharedWith;
    }

    public void setSharedWith(User sharedWith) {
        this.sharedWith = sharedWith;
    }

    // ==========================
    // Permission
    // ==========================

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    // ==========================
    // Created At
    // ==========================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ==========================
    // Automatically set date
    // ==========================

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}