package com.securevault.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.User;

public interface CredentialShareRepository
        extends JpaRepository<CredentialShare, Long> {

    boolean existsByCredentialAndSharedWithUser(
            Credential credential,
            User sharedWithUser
    );

    List<CredentialShare> findBySharedWithUser(User user);

    @Transactional
    void deleteByCredential(Credential credential);
}