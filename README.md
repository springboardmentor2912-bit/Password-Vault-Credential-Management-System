# 🔐 SecureVault — Password & Credential Management System

SecureVault is a secure web-based password and credential management system developed using React and Spring Boot.

The application allows users to securely manage their credentials, authenticate using JWT, generate strong passwords, and share credentials with other registered users using permission-based access.

## 🚀 Features

### 🔑 Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Logout
- Forgot Password
- OTP Verification
- Password Reset

### 🔐 Password Security
- BCrypt password hashing
- Password strength detection
- Weak / Medium / Strong password indication
- Strong password validation
- Secure password generator
- Password visibility control
- Copy password functionality

### 🗄️ Secure Password Vault
- Add credentials
- View credentials
- Edit credentials
- Delete credentials
- Search credentials by website
- Password visibility control
- Credential notes

### 🤝 Credential Sharing
- Share credentials with registered users
- Share using recipient email
- VIEW permission
- EDIT permission
- Shared credentials appear in the recipient's vault
- Shared credentials are clearly identified
- VIEW users cannot edit or delete shared credentials
- EDIT users can modify shared credentials
- Shared users cannot delete the owner's credential

### 📧 Email Notification
- Email notification when a credential is shared
- Recipient can log in to SecureVault and access the shared credential

### 🛡️ Security
- JWT authentication
- Protected backend APIs
- Authorization checks
- Permission-based credential access
- Encrypted vault credential storage
- Owner-only credential deletion

## 🛠️ Technology Stack

### Frontend
- React
- JavaScript
- Vite
- Axios
- React Router
- CSS

### Backend
- Java
- Spring Boot
- Spring Security
- JWT
- BCrypt
- REST APIs
- Maven

### Database
- MySQL
- JPA / Hibernate

## 📂 Project Structure

```text
SecureVault/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── ...
│
├── .gitignore
└── README.md