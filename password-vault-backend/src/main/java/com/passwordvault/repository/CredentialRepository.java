package com.passwordvault.repository;

import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, Long> {

    // Get all credentials of a user
    List<Credential> findByUser(User user);

    // Get credentials by category
    List<Credential> findByUserAndCategory(User user, String category);

    // Get favorite credentials
    List<Credential> findByUserAndFavoriteTrue(User user);

    // Search by website
    List<Credential> findByUserAndWebsiteContainingIgnoreCase(User user, String website);

    // Search by username
    List<Credential> findByUserAndUsernameContainingIgnoreCase(User user, String username);

    // Search by website OR username
    List<Credential> findByUserAndWebsiteContainingIgnoreCaseOrUserAndUsernameContainingIgnoreCase(
            User user,
            String website,
            User userAgain,
            String username
    );

}