package com.securevault.controller;

import com.securevault.entity.VaultShare;
import com.securevault.service.VaultShareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vault")
@RequiredArgsConstructor
public class VaultShareController {

    private final VaultShareService vaultShareService;

    @PostMapping("/{vaultEntryId}/share")
    public ResponseEntity<VaultShare> shareCredential(
            @PathVariable Long vaultEntryId,
            @RequestParam String sharedWithEmail,
            @RequestParam VaultShare.Permission permission,
            @RequestParam(required = false) LocalDate expiryDate,
            Authentication authentication) {

        VaultShare share = vaultShareService.shareCredential(
                vaultEntryId,
                authentication.getName(),
                sharedWithEmail,
                permission
        );

        return ResponseEntity.ok(share);
    }

    @GetMapping("/{vaultEntryId}/shares")
    public ResponseEntity<List<VaultShare>> getShares(
            @PathVariable Long vaultEntryId,
            Authentication authentication) {

        return ResponseEntity.ok(
                vaultShareService.getShares(
                        vaultEntryId,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/shares/{shareId}")
    public ResponseEntity<String> revokeShare(
            @PathVariable Long shareId,
            Authentication authentication) {

        vaultShareService.revokeShare(
                shareId,
                authentication.getName()
        );

        return ResponseEntity.ok("Access revoked successfully");
    }
}