package com.passwordvault.controller;

import com.passwordvault.dto.ShareCredentialRequest;
import com.passwordvault.entity.SharedCredential;
import com.passwordvault.service.SharingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sharing")
@CrossOrigin(origins = "http://localhost:5173")
public class SharingController {

    @Autowired
    private SharingService sharingService;

    // ==========================
    // Share Credential
    // ==========================

    @PostMapping("/share")
    public SharedCredential shareCredential(
            @RequestBody ShareCredentialRequest request,
            Authentication authentication) {

        return sharingService.shareCredential(
                request,
                authentication.getName()
        );
    }

    // ==========================
    // Get Shared With Me
    // ==========================

    @GetMapping("/shared-with-me")
    public List<SharedCredential> getSharedWithMe(
            Authentication authentication) {

        return sharingService.getSharedWithMe(
                authentication.getName()
        );
    }

    // ==========================
    // Get Credentials Shared By Me
    // ==========================

    @GetMapping("/my-shares")
    public List<SharedCredential> getSharedByMe(
            Authentication authentication) {

        return sharingService.getSharedByMe(
                authentication.getName()
        );
    }

    // ==========================
    // Get Permission
    // ==========================

    @GetMapping("/permission/{credentialId}")
    public String getPermission(
            @PathVariable Long credentialId,
            Authentication authentication) {

        return sharingService.getPermission(
                credentialId,
                authentication.getName()
        );
    }

    // ==========================
    // Remove Sharing
    // ==========================

    @DeleteMapping("/{sharingId}")
    public String removeSharing(
            @PathVariable Long sharingId,
            Authentication authentication) {

        return sharingService.removeSharing(
                sharingId,
                authentication.getName()
        );
    }
}