package com.securevault.controller;

import com.securevault.dto.SharedVaultResponse;
import com.securevault.entity.VaultEntry;
import com.securevault.service.VaultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
@RequiredArgsConstructor
public class VaultController {

    private final VaultService vaultService;

    @PostMapping
    public ResponseEntity<VaultEntry> addEntry(
            Authentication authentication,
            @Valid @RequestBody VaultEntry vaultEntry) {

        return ResponseEntity.ok(
                vaultService.addEntry(
                        authentication.getName(),
                        vaultEntry
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<VaultEntry>> getAllEntries(
            Authentication authentication) {

        return ResponseEntity.ok(
                vaultService.getAllEntries(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaultEntry> updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody VaultEntry vaultEntry,
            Authentication authentication) {

        return ResponseEntity.ok(
                vaultService.updateEntry(
                        id,
                        vaultEntry,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEntry(
            @PathVariable Long id,
            Authentication authentication) {

        vaultService.deleteEntry(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Credential deleted successfully"
        );
    }

    @GetMapping("/shared")
    public ResponseEntity<List<SharedVaultResponse>> getSharedEntries(
            Authentication authentication) {

        return ResponseEntity.ok(
                vaultService.getSharedEntries(
                        authentication.getName()
                )
        );
    }
}