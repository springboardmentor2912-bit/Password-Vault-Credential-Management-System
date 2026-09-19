# Password Vault & Credential Management System

A secure full-stack web application for storing, managing, and protecting user credentials in one centralized password vault.

## Features

- User Registration
- Secure Login with JWT Authentication
- BCrypt Password Hashing
- Add, View, Edit, and Delete Credentials
- Password Generation
- Password Sharing
- Password Visibility Toggle
- Forgot Password
- OTP Verification
- Password Reset
- User Profile Management
- Session Control
- Login Activity Monitoring
- Suspicious Activity Detection
- Security Alerts
- Audit Logs
- Security Analytics Dashboard
- Password Health Report
- Login Activity Report
- PostgreSQL Database Integration
- Responsive User Interface
- Inline Success and Error Messages

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Authentication | JWT, Spring Security |
| Password Hashing | BCrypt |
| Credential Security | Encryption |
| Email Service | Resend API |
| HTTP Client | Axios |
| Containerization | Docker |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |

## System Architecture

```text
                    User
                     |
                     v
              React Frontend
                 (Vercel)
                     |
                     | HTTPS / REST API
                     v
            Spring Boot Backend
                 (Render)
                     |
          +----------+----------+
          |                     |
          v                     v
     PostgreSQL             Resend API
       Database             OTP Emails
