package com.securevault.dto;

import com.securevault.entity.VaultShare.Permission;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SharedVaultResponse {

    private Long id;
    private String website;
    private String username;
    private String password;
    private String notes;
    private boolean shared;
    private Permission permission;
}