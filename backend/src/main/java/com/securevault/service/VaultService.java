package com.securevault.service;

import com.securevault.entity.User;
import com.securevault.entity.VaultEntry;
import com.securevault.entity.VaultShare;
import com.securevault.repository.UserRepository;
import com.securevault.repository.VaultRepository;
import com.securevault.repository.VaultShareRepository;
import com.securevault.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.securevault.dto.SharedVaultResponse;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaultService {

    private final VaultRepository vaultRepository;
    private final UserRepository userRepository;
    private final EncryptionUtil encryptionUtil;
    private final VaultShareRepository vaultShareRepository;

    public VaultEntry addEntry(String email, VaultEntry vaultEntry) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        vaultEntry.setUser(user);

        vaultEntry.setPassword(
                encryptionUtil.encrypt(vaultEntry.getPassword())
        );

        return vaultRepository.save(vaultEntry);
    }

    public List<VaultEntry> getAllEntries(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        List<VaultEntry> entries =
                vaultRepository.findByUser(user);

        entries.forEach(entry ->
                entry.setPassword(
                        encryptionUtil.decrypt(entry.getPassword())
                )
        );

        return entries;
    }

    public List<SharedVaultResponse> getSharedEntries(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        List<VaultShare> shares =
                vaultShareRepository.findBySharedWithUser(user);

        LocalDate today = LocalDate.now();

        return shares.stream()
                .filter(share ->
                        share.getExpiryDate() == null ||
                                !share.getExpiryDate().isBefore(today)
                )
                .map(share -> {

                    VaultEntry entry = share.getVaultEntry();

                    String decryptedPassword =
                            encryptionUtil.decrypt(
                                    entry.getPassword()
                            );

                    return new SharedVaultResponse(
                            entry.getId(),
                            entry.getWebsite(),
                            entry.getUsername(),
                            decryptedPassword,
                            entry.getNotes(),
                            true,
                            share.getPermission()
                    );
                })
                .toList();
    }

    public VaultEntry updateEntry(
            Long id,
            VaultEntry updatedEntry,
            String email) {

        VaultEntry vaultEntry = vaultRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vault entry not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        boolean isOwner =
                vaultEntry.getUser().getId().equals(user.getId());

        boolean hasEditPermission =
                vaultShareRepository
                        .findByVaultEntryAndSharedWithUser(
                                vaultEntry,
                                user
                        )
                        .filter(share ->
                                share.getExpiryDate() == null ||
                                        !share.getExpiryDate()
                                                .isBefore(LocalDate.now())
                        )
                        .map(share ->
                                share.getPermission()
                                        == VaultShare.Permission.EDIT
                        )
                        .orElse(false);

        if (!isOwner && !hasEditPermission) {
            throw new IllegalArgumentException(
                    "You do not have permission to edit this credential");
        }

        vaultEntry.setWebsite(updatedEntry.getWebsite());

        vaultEntry.setUsername(updatedEntry.getUsername());

        vaultEntry.setPassword(
                encryptionUtil.encrypt(
                        updatedEntry.getPassword()
                )
        );

        vaultEntry.setNotes(updatedEntry.getNotes());

        return vaultRepository.save(vaultEntry);
    }

    public void deleteEntry(
            Long id,
            String email) {

        VaultEntry vaultEntry =
                vaultRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vault entry not found"));

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"));

        boolean isOwner =
                vaultEntry.getUser().getId().equals(user.getId());

        if (!isOwner) {
            throw new IllegalArgumentException(
                    "Only the owner can delete this credential");
        }

        vaultRepository.delete(vaultEntry);
    }
}