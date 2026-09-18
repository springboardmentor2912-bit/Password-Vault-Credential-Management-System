package com.passwordvault.repository;

import com.passwordvault.entity.Credential;
import com.passwordvault.entity.SharedCredential;
import com.passwordvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SharedCredentialRepository
        extends JpaRepository<SharedCredential, Long> {

    // Credentials shared with a particular user
    List<SharedCredential> findBySharedWith(User user);

    // Credentials shared by the owner
    List<SharedCredential> findByOwner(User owner);

    // Find a specific sharing record
    Optional<SharedCredential> findByCredentialAndSharedWith(
            Credential credential,
            User sharedWith
    );

    // Find sharing record by credential and recipient
    Optional<SharedCredential> findByCredentialIdAndSharedWithId(
            Long credentialId,
            Long userId
    );

    // Check whether credential is already shared
    boolean existsByCredentialAndSharedWith(
            Credential credential,
            User sharedWith
    );

    // Delete a particular sharing record
    void deleteByCredentialAndSharedWith(
            Credential credential,
            User sharedWith
    );
}