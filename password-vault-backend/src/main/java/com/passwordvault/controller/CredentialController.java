package com.passwordvault.controller;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.service.CredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
@CrossOrigin(origins = "http://localhost:5173")
public class CredentialController {

    @Autowired
    private CredentialService credentialService;

    @PostMapping
    public Credential saveCredential(
            @RequestBody CredentialRequest request,
            Authentication authentication) {

        return credentialService.saveCredential(
                request,
                authentication.getName()
        );
    }

    @GetMapping
    public List<Credential> getAllCredentials(
            Authentication authentication) {

        return credentialService.getAllCredentials(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    public Credential getCredential(
            @PathVariable Long id,
            Authentication authentication) {

        return credentialService.getCredential(
                id,
                authentication.getName()
        );
    }

    @PutMapping("/{id}")
    public Credential updateCredential(
            @PathVariable Long id,
            @RequestBody CredentialRequest request,
            Authentication authentication) {

        return credentialService.updateCredential(
                id,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteCredential(
            @PathVariable Long id,
            Authentication authentication) {

        return credentialService.deleteCredential(
                id,
                authentication.getName()
        );
    }
}