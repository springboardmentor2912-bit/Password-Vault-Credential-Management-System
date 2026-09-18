package com.passwordvault.service;

import com.passwordvault.dto.CredentialRequest;
import com.passwordvault.entity.Credential;
import com.passwordvault.entity.User;
import com.passwordvault.repository.CredentialRepository;
import com.passwordvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialService {

    @Autowired
    private CredentialRepository credentialRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EncryptionService encryptionService;

    // ==========================
    // Save Credential
    // ==========================
    public Credential saveCredential(CredentialRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credential credential = new Credential();

        credential.setWebsite(request.getWebsite());
        credential.setUsername(request.getUsername());

        credential.setPassword(
                encryptionService.encrypt(request.getPassword())
        );

        credential.setNotes(request.getNotes());
        credential.setCategory(request.getCategory());
        credential.setFavorite(request.isFavorite());
        credential.setUser(user);

        return credentialRepository.save(credential);
    }

    // ==========================
    // Get All Credentials
    // ==========================
    public List<Credential> getAllCredentials(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Credential> credentials =
                credentialRepository.findByUser(user);

        for (Credential credential : credentials) {

            credential.setPassword(
                    encryptionService.decrypt(
                            credential.getPassword()
                    )
            );

        }

        return credentials;
    }

    // ==========================
    // Get Credential By Id
    // ==========================
    public Credential getCredential(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied");
        }

        credential.setPassword(
                encryptionService.decrypt(
                        credential.getPassword()
                )
        );

        return credential;
    }

    // ==========================
    // Update Credential
    // ==========================
    public Credential updateCredential(Long id,
                                       CredentialRequest request,
                                       String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied");
        }

        credential.setWebsite(request.getWebsite());
        credential.setUsername(request.getUsername());

        credential.setPassword(
                encryptionService.encrypt(
                        request.getPassword()
                )
        );

        credential.setNotes(request.getNotes());
        credential.setCategory(request.getCategory());
        credential.setFavorite(request.isFavorite());

        return credentialRepository.save(credential);
    }

    // ==========================
    // Delete Credential
    // ==========================
    public String deleteCredential(Long id,
                                   String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied");
        }

        credentialRepository.delete(credential);

        return "Credential deleted successfully.";
    }

    // ==========================
    // Toggle Favorite
    // ==========================
    public Credential toggleFavorite(Long id) {

        Credential credential = credentialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        credential.setFavorite(!credential.isFavorite());

        return credentialRepository.save(credential);
    }

    // ==========================
    // Get By Category
    // ==========================
    public List<Credential> getCredentialsByCategory(
            String email,
            String category) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Credential> credentials =
                credentialRepository.findByUserAndCategory(
                        user,
                        category
                );

        for (Credential credential : credentials) {

            credential.setPassword(
                    encryptionService.decrypt(
                            credential.getPassword()
                    )
            );

        }

        return credentials;
    }

    // ==========================
    // Favorites
    // ==========================
    public List<Credential> getFavoriteCredentials(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Credential> credentials =
                credentialRepository.findByUserAndFavoriteTrue(user);

        for (Credential credential : credentials) {

            credential.setPassword(
                    encryptionService.decrypt(
                            credential.getPassword()
                    )
            );

        }

        return credentials;
    }

    // ==========================
    // Search
    // ==========================
    public List<Credential> searchCredentials(
            String email,
            String keyword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Credential> credentials =
                credentialRepository
                        .findByUserAndWebsiteContainingIgnoreCaseOrUserAndUsernameContainingIgnoreCase(
                                user,
                                keyword,
                                user,
                                keyword
                        );

        for (Credential credential : credentials) {

            credential.setPassword(
                    encryptionService.decrypt(
                            credential.getPassword()
                    )
            );

        }

        return credentials;
    }

}