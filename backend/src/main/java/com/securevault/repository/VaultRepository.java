package com.securevault.repository;

import com.securevault.entity.User;
import com.securevault.entity.VaultEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VaultRepository extends JpaRepository<VaultEntry, Long> {

    List<VaultEntry> findByUser(User user);

    Optional<VaultEntry> findByIdAndUser(Long id, User user);

}