package com.securevault.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.securevault.backend.entity.Permission;
import com.securevault.backend.service.CredentialShareService;

@RestController
@RequestMapping("/api/credential-sharing")
@CrossOrigin("*")
public class CredentialShareController {

    private final CredentialShareService credentialShareService;

    public CredentialShareController(
            CredentialShareService credentialShareService) {

        this.credentialShareService = credentialShareService;
    }

    @PostMapping("/{credentialId}/share")
    public ResponseEntity<String> shareCredential(

            @PathVariable Long credentialId,

            @RequestParam String ownerEmail,

            @RequestParam String recipientEmail,

            @RequestParam Permission permission) {

        credentialShareService.shareCredential(
                credentialId,
                ownerEmail,
                recipientEmail,
                permission
        );

        return ResponseEntity.ok(
                "Credential shared successfully"
        );
    }
}