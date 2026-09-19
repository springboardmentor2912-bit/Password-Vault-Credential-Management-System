package com.securevault.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.dto.CredentialRequest;
import com.securevault.backend.dto.CredentialResponse;
import com.securevault.backend.entity.Credential;
import com.securevault.backend.service.CredentialService;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin("*")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }

    // Add Credential
    @PostMapping
    public ResponseEntity<Credential> addCredential(
            @RequestParam String email,
            @RequestBody CredentialRequest request) {

        return ResponseEntity.ok(
                credentialService.addCredential(
                        email,
                        request
                )
        );
    }

    // Get Own + Shared Credentials
    @GetMapping
    public ResponseEntity<List<CredentialResponse>> getCredentials(
            @RequestParam String email) {

        return ResponseEntity.ok(
                credentialService.getCredentials(email)
        );
    }

    // Delete Credential
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCredential(
            @PathVariable Long id,
            @RequestParam String email) {

        try {

            credentialService.deleteCredential(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    "Credential Deleted Successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // Update Credential
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCredential(
            @PathVariable Long id,
            @RequestParam String email,
            @RequestBody CredentialRequest request) {

        try {

            return ResponseEntity.ok(
                    credentialService.updateCredential(
                            id,
                            email,
                            request
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}