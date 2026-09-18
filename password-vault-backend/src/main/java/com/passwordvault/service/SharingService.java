package com.passwordvault.service;

import com.passwordvault.dto.ShareCredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.SharedCredential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.SharedCredentialRepository;
import com.passwordvault.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SharingService {

    @Autowired
    private SharedCredentialRepository sharedCredentialRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;


    // =====================================================
    // SHARE CREDENTIAL
    // =====================================================

    public SharedCredential shareCredential(
            ShareCredentialRequest request,
            String ownerEmail) {

        // Validate request
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Share request cannot be empty"
            );
        }

        if (request.getCredentialId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Credential ID is required"
            );
        }

        if (request.getRecipientEmail() == null ||
                request.getRecipientEmail().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Recipient email is required"
            );
        }

        if (request.getPermission() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Permission is required"
            );
        }


        // =====================================================
        // FIND OWNER
        // =====================================================

        User owner = userRepository
                .findByEmail(ownerEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Owner account not found"
                        )
                );


        // =====================================================
        // FIND CREDENTIAL
        // =====================================================

        Credential credential =
                credentialRepository
                        .findById(request.getCredentialId())
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Credential not found"
                                )
                        );


        // =====================================================
        // CHECK CREDENTIAL OWNER
        // =====================================================

        if (credential.getUser() == null ||
                !credential.getUser()
                        .getId()
                        .equals(owner.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only share your own credentials"
            );
        }


        // =====================================================
        // FIND RECIPIENT
        // =====================================================

        String recipientEmail =
                request.getRecipientEmail()
                        .trim()
                        .toLowerCase();

        User recipient =
                userRepository
                        .findByEmail(recipientEmail)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Recipient email is not registered"
                                )
                        );


        // =====================================================
        // OWNER CANNOT SHARE WITH SELF
        // =====================================================

        if (owner.getId().equals(recipient.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot share a credential with yourself"
            );
        }


        // =====================================================
        // CHECK EXISTING SHARE
        // =====================================================

        if (sharedCredentialRepository
                .existsByCredentialAndSharedWith(
                        credential,
                        recipient)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Credential is already shared with this user"
            );
        }


        // =====================================================
        // CREATE SHARING RECORD
        // =====================================================

        SharedCredential sharedCredential =
                new SharedCredential();

        sharedCredential.setCredential(credential);
        sharedCredential.setOwner(owner);
        sharedCredential.setSharedWith(recipient);
        sharedCredential.setPermission(
                request.getPermission()
        );


        // =====================================================
        // SAVE SHARING RECORD
        // =====================================================

        SharedCredential savedSharing =
                sharedCredentialRepository.save(
                        sharedCredential
                );


        // =====================================================
        // SEND EMAIL TO RECIPIENT
        // =====================================================

        emailService.sendSharingEmail(
                recipient.getEmail(),
                owner.getEmail(),
                credential.getWebsite(),
                request.getPermission().name()
        );


        return savedSharing;
    }


    // =====================================================
    // GET SHARED WITH ME
    // =====================================================

    public List<SharedCredential> getSharedWithMe(
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "User not found"
                                )
                        );

        return sharedCredentialRepository
                .findBySharedWith(user);
    }


    // =====================================================
    // GET MY SHARES
    // =====================================================

    public List<SharedCredential> getSharedByMe(
            String email) {

        User owner =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "User not found"
                                )
                        );

        return sharedCredentialRepository
                .findByOwner(owner);
    }


    // =====================================================
    // GET PERMISSION
    // =====================================================

    public String getPermission(
            Long credentialId,
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "User not found"
                                )
                        );


        Credential credential =
                credentialRepository
                        .findById(credentialId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Credential not found"
                                )
                        );


        // Owner automatically has full management
        if (credential.getUser() != null &&
                credential.getUser()
                        .getId()
                        .equals(user.getId())) {

            return "FULL_MANAGEMENT";
        }


        SharedCredential sharedCredential =
                sharedCredentialRepository
                        .findByCredentialIdAndSharedWithId(
                                credentialId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "You don't have access to this credential"
                                )
                        );


        return sharedCredential
                .getPermission()
                .name();
    }


    // =====================================================
    // REMOVE SHARING
    // =====================================================

    public String removeSharing(
            Long sharingId,
            String ownerEmail) {

        User owner =
                userRepository
                        .findByEmail(ownerEmail)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Owner not found"
                                )
                        );


        SharedCredential sharedCredential =
                sharedCredentialRepository
                        .findById(sharingId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Sharing record not found"
                                )
                        );


        // Only owner can remove sharing
        if (sharedCredential.getOwner() == null ||
                !sharedCredential.getOwner()
                        .getId()
                        .equals(owner.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the owner can remove sharing"
            );
        }


        sharedCredentialRepository.delete(
                sharedCredential
        );

        return "Credential sharing removed successfully";
    }
}