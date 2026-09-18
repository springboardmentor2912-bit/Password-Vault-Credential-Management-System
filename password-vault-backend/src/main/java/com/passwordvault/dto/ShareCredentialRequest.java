package com.passwordvault.dto;

import com.passwordvault.entity.Permission;

public class ShareCredentialRequest {

    private Long credentialId;

    private String recipientEmail;

    private Permission permission;

    public ShareCredentialRequest() {
    }

    // Credential ID
    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    // Recipient Email
    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    // Permission
    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }
}