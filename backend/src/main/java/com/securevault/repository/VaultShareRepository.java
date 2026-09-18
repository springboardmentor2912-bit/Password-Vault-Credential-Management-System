package com.securevault.repository;

import com.securevault.entity.User;
import com.securevault.entity.VaultEntry;
import com.securevault.entity.VaultShare;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VaultShareRepository extends JpaRepository<VaultShare, Long> {

    List<VaultShare> findBySharedWithUser(User user);

    List<VaultShare> findByVaultEntry(VaultEntry vaultEntry);

    Optional<VaultShare> findByVaultEntryAndSharedWithUser(
            VaultEntry vaultEntry,
            User user
    );
}