package com.securevault.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.entity.CredentialShare;
import com.securevault.backend.entity.Permission;
import com.securevault.backend.entity.User;
import com.securevault.backend.repository.CredentialRepository;
import com.securevault.backend.repository.CredentialShareRepository;
import com.securevault.backend.repository.UserRepository;
import com.securevault.backend.utils.AESUtil;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;
    private final CredentialShareRepository credentialShareRepository;

    public CredentialService(
            CredentialRepository credentialRepository,
            UserRepository userRepository,
            CredentialShareRepository credentialShareRepository) {

        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
        this.credentialShareRepository = credentialShareRepository;
    }

    // ==========================================
    // Add Credential
    // ==========================================

    public Credential addCredential(
            String email,
            CredentialRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Credential credential = new Credential();

        credential.setWebsite(
                request.getWebsite());

        credential.setUsername(
                request.getUsername());

        // Encrypt password before storing
        credential.setPassword(
                AESUtil.encrypt(
                        request.getPassword()
                )
        );

        // Record password creation/update time
        credential.setPasswordUpdatedAt(
                LocalDateTime.now()
        );

        credential.setCategory(
                request.getCategory());

        credential.setFavourite(
                request.isFavourite());

        credential.setUser(user);

        return credentialRepository.save(
                credential
        );
    }

    // ==========================================
    // View Own + Shared Credentials
    // ==========================================

    public List<CredentialResponse> getCredentials(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Own credentials
        List<Credential> ownCredentials =
                credentialRepository.findByUser(user);

        // Shared credentials
        List<CredentialShare> shares =
                credentialShareRepository
                        .findBySharedWithUser(user);

        /*
         * LinkedHashMap prevents duplicate credentials
         * while maintaining the original order.
         */
        Map<Long, CredentialResponse> credentialMap =
                new LinkedHashMap<>();

        // Add own credentials
        for (Credential credential : ownCredentials) {

            CredentialResponse response =
                    convertToResponse(
                            credential,
                            Permission.FULL
                    );

            credentialMap.put(
                    credential.getId(),
                    response
            );
        }

        // Add shared credentials
        for (CredentialShare share : shares) {

            Credential credential =
                    share.getCredential();

            if (credential != null) {

                Permission permission =
                        share.getPermission();

                /*
                 * If permission is null for an old share,
                 * default to VIEW for safety.
                 */
                if (permission == null) {
                    permission = Permission.VIEW;
                }

                CredentialResponse response =
                        convertToResponse(
                                credential,
                                permission
                        );

                /*
                 * Do not overwrite an owner's credential
                 * with a shared version.
                 */
                credentialMap.putIfAbsent(
                        credential.getId(),
                        response
                );
            }
        }

        return new ArrayList<>(
                credentialMap.values()
        );
    }

    // ==========================================
    // Convert Credential entity to response DTO
    // ==========================================

    private CredentialResponse convertToResponse(
            Credential credential,
            Permission permission) {

        CredentialResponse response =
                new CredentialResponse();

        response.setId(
                credential.getId());

        response.setWebsite(
                credential.getWebsite());

        response.setUsername(
                credential.getUsername());

        // Decrypt only when sending response
        response.setPassword(
                AESUtil.decrypt(
                        credential.getPassword()
                )
        );

        response.setCategory(
                credential.getCategory()
        );

        response.setFavourite(
                credential.isFavourite()
        );

        response.setPermission(
                permission
        );

        return response;
    }

    // ==========================================
    // Check whether user can view credential
    // ==========================================

    public boolean canView(
            Long credentialId,
            String email) {

        getUserPermission(
                credentialId,
                email
        );

        return true;
    }

    // ==========================================
    // Check whether user can edit credential
    // ==========================================

    public boolean canEdit(
            Long credentialId,
            String email) {

        Permission permission =
                getUserPermission(
                        credentialId,
                        email
                );

        return permission == Permission.EDIT
                || permission == Permission.FULL;
    }

    // ==========================================
    // Check whether user can delete credential
    // ==========================================

    public boolean canDelete(
            Long credentialId,
            String email) {

        Permission permission =
                getUserPermission(
                        credentialId,
                        email
                );

        return permission == Permission.FULL;
    }

    // ==========================================
    // Check whether user can manage sharing
    // ==========================================

    public boolean canManageSharing(
            Long credentialId,
            String email) {

        Permission permission =
                getUserPermission(
                        credentialId,
                        email
                );

        return permission == Permission.FULL;
    }

    // ==========================================
    // Get user's permission for a credential
    // ==========================================

    public Permission getUserPermission(
            Long credentialId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        Credential credential =
                credentialRepository.findById(credentialId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        /*
         * Owner always has full permission.
         */
        if (credential.getUser().getId()
                .equals(user.getId())) {

            return Permission.FULL;
        }

        /*
         * Find shared credential relationship.
         */
        List<CredentialShare> shares =
                credentialShareRepository
                        .findBySharedWithUser(user);

        for (CredentialShare share : shares) {

            Credential sharedCredential =
                    share.getCredential();

            if (sharedCredential != null
                    && sharedCredential.getId()
                            .equals(credentialId)) {

                Permission permission =
                        share.getPermission();

                if (permission == null) {

                    return Permission.VIEW;
                }

                return permission;
            }
        }

        throw new RuntimeException(
                "You do not have access to this credential"
        );
    }

    // ==========================================
    // Update Credential
    // ==========================================

    public Credential updateCredential(
            Long id,
            String email,
            CredentialRequest request) {

        Permission permission =
                getUserPermission(
                        id,
                        email
                );

        /*
         * Only EDIT and FULL can update.
         */
        if (permission != Permission.EDIT
                && permission != Permission.FULL) {

            throw new RuntimeException(
                    "You do not have permission to edit this credential"
            );
        }

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        credential.setWebsite(
                request.getWebsite()
        );

        credential.setUsername(
                request.getUsername()
        );

        // Encrypt updated password
        credential.setPassword(
                AESUtil.encrypt(
                        request.getPassword()
                )
        );

        // Update password modification time
        credential.setPasswordUpdatedAt(
                LocalDateTime.now()
        );

        credential.setCategory(
                request.getCategory()
        );

        credential.setFavourite(
                request.isFavourite()
        );

        return credentialRepository.save(
                credential
        );
    }

    // ==========================================
    // Delete Credential
    // ==========================================

    @Transactional
    public void deleteCredential(
            Long id,
            String email) {

        Permission permission =
                getUserPermission(
                        id,
                        email
                );

        /*
         * Only FULL permission can delete.
         */
        if (permission != Permission.FULL) {

            throw new RuntimeException(
                    "You do not have permission to delete this credential"
            );
        }

        Credential credential =
                credentialRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"
                                ));

        // Delete sharing records first
        credentialShareRepository
                .deleteByCredential(
                        credential
                );

        // Then delete credential
        credentialRepository.delete(
                credential
        );
    }
}