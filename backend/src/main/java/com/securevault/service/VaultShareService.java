package com.securevault.service;

import com.securevault.entity.NotificationType;
import com.securevault.entity.User;
import com.securevault.entity.VaultEntry;
import com.securevault.entity.VaultShare;
import com.securevault.repository.UserRepository;
import com.securevault.repository.VaultRepository;
import com.securevault.repository.VaultShareRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaultShareService {

    private final VaultShareRepository vaultShareRepository;
    private final VaultRepository vaultRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public VaultShare shareCredential(
            Long vaultEntryId,
            String ownerEmail,
            String sharedWithEmail,
            VaultShare.Permission permission) {

        VaultEntry vaultEntry = vaultRepository.findById(vaultEntryId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Vault entry not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Owner not found"));

        User sharedWithUser = userRepository.findByEmail(sharedWithEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User to share with not found"));

        if (!vaultEntry.getUser().getId().equals(owner.getId())) {
            throw new IllegalArgumentException(
                    "You are not the owner of this credential");
        }

        if (owner.getId().equals(sharedWithUser.getId())) {
            throw new IllegalArgumentException(
                    "You cannot share a credential with yourself");
        }

        VaultShare existingShare =
                vaultShareRepository
                        .findByVaultEntryAndSharedWithUser(
                                vaultEntry,
                                sharedWithUser)
                        .orElse(null);

        if (existingShare != null) {
            existingShare.setPermission(permission);

            return vaultShareRepository.save(existingShare);
        }

        VaultShare share = VaultShare.builder()
                .vaultEntry(vaultEntry)
                .sharedWithUser(sharedWithUser)
                .permission(permission)
                .build();

        VaultShare savedShare =
                vaultShareRepository.save(share);

        // =====================================================
        // NOTIFICATION TO RECIPIENT
        // =====================================================

        String notificationMessage =
                owner.getFullName()
                        + " has shared a credential with you."
                        + " Permission: "
                        + permission;

        notificationService.createNotification(
                sharedWithUser.getId(),
                NotificationType.CREDENTIAL_SHARED,
                "Credential Shared With You",
                notificationMessage
        );

        // =====================================================
        // EMAIL TO RECIPIENT
        // =====================================================

        emailService.sendCredentialSharedNotification(
                sharedWithUser.getEmail(),
                sharedWithUser.getFullName(),
                owner.getFullName(),
                permission.toString()
        );

        return savedShare;
    }

    public List<VaultShare> getShares(
            Long vaultEntryId,
            String ownerEmail) {

        VaultEntry vaultEntry = vaultRepository.findById(vaultEntryId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Vault entry not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Owner not found"));

        if (!vaultEntry.getUser().getId().equals(owner.getId())) {
            throw new IllegalArgumentException(
                    "You are not the owner of this credential");
        }

        return vaultShareRepository.findByVaultEntry(vaultEntry);
    }

    public void revokeShare(
            Long shareId,
            String ownerEmail) {

        VaultShare share = vaultShareRepository.findById(shareId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Share not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Owner not found"));

        if (!share.getVaultEntry().getUser().getId().equals(owner.getId())) {
            throw new IllegalArgumentException(
                    "You are not the owner of this credential");
        }

        vaultShareRepository.delete(share);
    }
}