package com.infosys.vault.util;

import org.apache.poi.sl.usermodel.ShapeType;
import org.apache.poi.sl.usermodel.TextParagraph.TextAlign;
import org.apache.poi.xslf.usermodel.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.Color;
import java.awt.geom.Rectangle2D;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class PptxGenerator {

    private static final Logger logger = LoggerFactory.getLogger(PptxGenerator.class);

    // Theme Colors
    private static final Color BG_DARK = new Color(15, 23, 42);        // #0F172A Dark Slate
    private static final Color CARD_BG = new Color(30, 41, 59);        // #1E293B Slate Card
    private static final Color CARD_BORDER = new Color(51, 65, 85);    // #334155 Slate Border
    private static final Color ACCENT_BLUE = new Color(79, 70, 229);   // #4F46E5 Indigo / Blue
    private static final Color ACCENT_CYAN = new Color(6, 182, 212);    // #06B6D4 Cyan
    private static final Color ACCENT_GREEN = new Color(16, 185, 129);  // #10B981 Emerald Green
    private static final Color TEXT_WHITE = new Color(248, 250, 252);   // #F8FAFC White
    private static final Color TEXT_MUTED = new Color(148, 163, 184);  // #94A3B8 Muted Light Gray

    public static void generatePresentation(OutputStream outputStream) throws Exception {
        try (XMLSlideShow ppt = new XMLSlideShow()) {
            // Set 16:9 Widescreen Dimension (960 x 540 pt)
            ppt.setPageSize(new java.awt.Dimension(960, 540));

            // Generate 10 Professional Slides
            createSlide1(ppt);  // Title Slide
            createSlide2(ppt);  // Executive Summary & Problem Statement
            createSlide3(ppt);  // Architecture & Technology Stack
            createSlide4(ppt);  // Zero-Knowledge Cryptographic Blueprint
            createSlide5(ppt);  // Multi-Category Vault Management
            createSlide6(ppt);  // Email OTP Two-Factor Verification
            createSlide7(ppt);  // Password Health & Breach Analytics Engine
            createSlide8(ppt);  // Security Audit & Suspicious Activity Alerts
            createSlide9(ppt);  // Exportable PDF Reports & DevOps Setup
            createSlide10(ppt); // Future Roadmap & Project Conclusion

            ppt.write(outputStream);
        }
    }

    // Helper: Base slide setup with dark background & footer
    private static XSLFSlide createBaseSlide(XMLSlideShow ppt, String category, String title, int pageNum) {
        XSLFSlide slide = ppt.createSlide();
        XSLFBackground bg = slide.getBackground();
        bg.setFillColor(BG_DARK);

        // Header Category Pill
        XSLFAutoShape categoryBox = slide.createAutoShape();
        categoryBox.setShapeType(ShapeType.ROUND_RECT);
        categoryBox.setAnchor(new Rectangle2D.Double(40, 25, 240, 22));
        categoryBox.setFillColor(new Color(79, 70, 229, 60)); // Transparent Indigo
        categoryBox.setLineColor(ACCENT_BLUE);
        categoryBox.setLineWidth(1.0);

        XSLFTextParagraph catPara = categoryBox.addNewTextParagraph();
        XSLFTextRun catRun = catPara.addNewTextRun();
        catRun.setText(category.toUpperCase());
        catRun.setFontColor(ACCENT_CYAN);
        catRun.setFontSize(10.0);
        catRun.setBold(true);
        catRun.setFontFamily("Segoe UI");

        // Main Title
        XSLFTextBox titleBox = slide.createTextBox();
        titleBox.setAnchor(new Rectangle2D.Double(40, 50, 880, 45));
        XSLFTextParagraph titlePara = titleBox.addNewTextParagraph();
        XSLFTextRun titleRun = titlePara.addNewTextRun();
        titleRun.setText(title);
        titleRun.setFontColor(TEXT_WHITE);
        titleRun.setFontSize(22.0);
        titleRun.setBold(true);
        titleRun.setFontFamily("Segoe UI");

        // Footer Line & Text
        XSLFAutoShape footerLine = slide.createAutoShape();
        footerLine.setShapeType(ShapeType.RECT);
        footerLine.setAnchor(new Rectangle2D.Double(40, 500, 880, 1));
        footerLine.setFillColor(CARD_BORDER);
        footerLine.setLineColor(CARD_BORDER);

        XSLFTextBox footerBox = slide.createTextBox();
        footerBox.setAnchor(new Rectangle2D.Double(40, 505, 600, 25));
        XSLFTextParagraph fPara = footerBox.addNewTextParagraph();
        XSLFTextRun fRun = fPara.addNewTextRun();
        fRun.setText("Password Fault & Vault Credential System • Technical Presentation");
        fRun.setFontColor(TEXT_MUTED);
        fRun.setFontSize(9.0);
        fRun.setFontFamily("Segoe UI");

        XSLFTextBox pageBox = slide.createTextBox();
        pageBox.setAnchor(new Rectangle2D.Double(820, 505, 100, 25));
        XSLFTextParagraph pPara = pageBox.addNewTextParagraph();
        pPara.setTextAlign(TextAlign.RIGHT);
        XSLFTextRun pRun = pPara.addNewTextRun();
        pRun.setText("Page " + pageNum + " / 10");
        pRun.setFontColor(ACCENT_CYAN);
        pRun.setFontSize(9.0);
        pRun.setBold(true);
        pRun.setFontFamily("Segoe UI");

        return slide;
    }

    // Helper: Create a styled content card
    private static void createCard(XSLFSlide slide, double x, double y, double w, double h, String cardTitle, String[] bullets) {
        XSLFAutoShape card = slide.createAutoShape();
        card.setShapeType(ShapeType.ROUND_RECT);
        card.setAnchor(new Rectangle2D.Double(x, y, w, h));
        card.setFillColor(CARD_BG);
        card.setLineColor(CARD_BORDER);
        card.setLineWidth(1.0);

        XSLFTextBox textContainer = slide.createTextBox();
        textContainer.setAnchor(new Rectangle2D.Double(x + 15, y + 12, w - 30, h - 24));

        // Card Header
        XSLFTextParagraph headerPara = textContainer.addNewTextParagraph();
        headerPara.setSpaceAfter(8.0);
        XSLFTextRun headerRun = headerPara.addNewTextRun();
        headerRun.setText(cardTitle);
        headerRun.setFontColor(ACCENT_CYAN);
        headerRun.setFontSize(14.0);
        headerRun.setBold(true);
        headerRun.setFontFamily("Segoe UI");

        // Bullet Points
        for (String bullet : bullets) {
            XSLFTextParagraph bulletPara = textContainer.addNewTextParagraph();
            bulletPara.setSpaceAfter(6.0);
            bulletPara.setIndent(-12.0);
            bulletPara.setLeftMargin(15.0);

            XSLFTextRun dotRun = bulletPara.addNewTextRun();
            dotRun.setText("▪ ");
            dotRun.setFontColor(ACCENT_BLUE);
            dotRun.setFontSize(11.0);
            dotRun.setBold(true);

            XSLFTextRun bodyRun = bulletPara.addNewTextRun();
            bodyRun.setText(bullet);
            bodyRun.setFontColor(TEXT_WHITE);
            bodyRun.setFontSize(11.0);
            bodyRun.setFontFamily("Segoe UI");
        }
    }

    // SLIDE 1: Title Slide
    private static void createSlide1(XMLSlideShow ppt) {
        XSLFSlide slide = ppt.createSlide();
        XSLFBackground bg = slide.getBackground();
        bg.setFillColor(BG_DARK);

        // Center Hero Card
        XSLFAutoShape heroCard = slide.createAutoShape();
        heroCard.setShapeType(ShapeType.ROUND_RECT);
        heroCard.setAnchor(new Rectangle2D.Double(60, 50, 840, 440));
        heroCard.setFillColor(CARD_BG);
        heroCard.setLineColor(ACCENT_BLUE);
        heroCard.setLineWidth(2.0);

        XSLFTextBox titleBox = slide.createTextBox();
        titleBox.setAnchor(new Rectangle2D.Double(90, 80, 780, 380));

        // Badge
        XSLFTextParagraph p0 = titleBox.addNewTextParagraph();
        p0.setSpaceAfter(15.0);
        XSLFTextRun r0 = p0.addNewTextRun();
        r0.setText("ENTERPRISE ZERO-KNOWLEDGE CREDENTIAL SYSTEM");
        r0.setFontColor(ACCENT_CYAN);
        r0.setFontSize(12.0);
        r0.setBold(true);
        r0.setFontFamily("Segoe UI");

        // Main Title
        XSLFTextParagraph p1 = titleBox.addNewTextParagraph();
        p1.setSpaceAfter(12.0);
        XSLFTextRun r1 = p1.addNewTextRun();
        r1.setText("Password Fault & Vault Management");
        r1.setFontColor(TEXT_WHITE);
        r1.setFontSize(32.0);
        r1.setBold(true);
        r1.setFontFamily("Segoe UI");

        // Subtitle
        XSLFTextParagraph p2 = titleBox.addNewTextParagraph();
        p2.setSpaceAfter(30.0);
        XSLFTextRun r2 = p2.addNewTextRun();
        r2.setText("Comprehensive Overview of Architecture, Client-Side AES-256-GCM Encryption,\nPassword Health Auditing, & Multi-Factor Security System");
        r2.setFontColor(TEXT_MUTED);
        r2.setFontSize(14.0);
        r2.setFontFamily("Segoe UI");

        // Highlights List
        String[] highlights = {
            "Zero-Knowledge PBKDF2 + AES-256-GCM Architecture",
            "Full Stack Java Spring Boot 3 + React 18 + PostgreSQL Stack",
            "Automated PDF Security Reporting & Suspicious Activity Alerts",
            "Multi-Category Vault Management with Role-Based Sharing"
        };
        for (String highlight : highlights) {
            XSLFTextParagraph hp = titleBox.addNewTextParagraph();
            hp.setSpaceAfter(6.0);
            hp.setIndent(-15.0);
            hp.setLeftMargin(18.0);

            XSLFTextRun dot = hp.addNewTextRun();
            dot.setText("✔ ");
            dot.setFontColor(ACCENT_GREEN);
            dot.setFontSize(12.0);
            dot.setBold(true);

            XSLFTextRun txt = hp.addNewTextRun();
            txt.setText(highlight);
            txt.setFontColor(TEXT_WHITE);
            txt.setFontSize(12.0);
            txt.setFontFamily("Segoe UI");
        }

        // Presenter Footer Info
        XSLFTextParagraph pFoot = titleBox.addNewTextParagraph();
        pFoot.setSpaceBefore(25.0);
        XSLFTextRun rFoot = pFoot.addNewTextRun();
        rFoot.setText("Developed by: Rabindra Dakua  |  MCA Project (Infosys Training)  |  Java & Security Architecture");
        rFoot.setFontColor(ACCENT_CYAN);
        rFoot.setFontSize(11.0);
        rFoot.setBold(true);
        rFoot.setFontFamily("Segoe UI");
    }

    // SLIDE 2: Executive Summary & Problem Statement
    private static void createSlide2(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "OVERVIEW & MOTIVATION", "Executive Summary & Industry Problem Statement", 2);

        createCard(slide, 40, 105, 425, 375, "🚨 Modern Security Challenges", new String[]{
            "Password Reuse & Fatigue: Users reuse simple passwords across dozens of personal and business accounts.",
            "Plaintext & Server Leaks: Traditional systems store readable passwords or weak reversible hashes prone to leaks.",
            "Lack of Audit Visibility: Organizations lack insight into weak credentials, compromised logins, and unauthorized access.",
            "Sophisticated Attacks: Credential stuffing, brute force, and session hijacking threaten enterprise accounts daily."
        });

        createCard(slide, 495, 105, 425, 375, "🛡️ Password Fault Solution", new String[]{
            "Zero-Knowledge Storage: Decryption keys stay on client devices. Server stores only encrypted ciphertexts.",
            "PBKDF2 Key Derivation: Master Key derived locally with 100,000 SHA-256 iterations & unique per-user salt.",
            "Integrated Health Engine: Real-time strength scoring, duplicate detection, and breach vulnerability alerts.",
            "Enterprise Auditability: Complete access logging, PDF security reporting, and instant threat notifications."
        });
    }

    // SLIDE 3: System Architecture & Modern Tech Stack
    private static void createSlide3(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "SYSTEM ARCHITECTURE", "High-Level Architecture & Technical Stack", 3);

        createCard(slide, 40, 105, 280, 375, "☕ Java Backend Stack", new String[]{
            "Java 17 & Spring Boot 3.2.3",
            "Spring Security (Stateless JWT)",
            "Spring Data JPA & Hibernate",
            "Spring Boot Mail & Resend API",
            "OpenPDF 1.3.37 for Reporting",
            "Maven Multi-Module Build"
        });

        createCard(slide, 340, 105, 280, 375, "⚛️ React Frontend Stack", new String[]{
            "React 18 with Vite Build System",
            "Tailwind CSS Dark Glassmorphism",
            "Lucide React Modern Iconography",
            "Axios REST Client & Interceptors",
            "Web Crypto API (PBKDF2 & AES)",
            "Responsive Desktop & Mobile UI"
        });

        createCard(slide, 640, 105, 280, 375, "🐳 Database & DevOps Stack", new String[]{
            "PostgreSQL 14 (Production Database)",
            "MySQL 8 & H2 Database (Dev/Test)",
            "Docker & Docker Compose Stack",
            "Nginx Reverse Proxy & Static Host",
            "Postman API Test Collections",
            "Git / GitHub Automated Workflows"
        });
    }

    // SLIDE 4: Zero-Knowledge Cryptographic Blueprint
    private static void createSlide4(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "CRYPTOGRAPHY & SECURITY", "Zero-Knowledge Vault Blueprint & Key Derivation", 4);

        createCard(slide, 40, 105, 425, 375, "🔐 Client-Side Key Derivation (PBKDF2)", new String[]{
            "User Master Password + Unique Salt is processed locally using PBKDF2-HMAC-SHA256 (100,000 iterations).",
            "Generates two separate keys: 1) Auth Hash for server login, 2) Data Encryption Key (DEK) for vault encryption.",
            "Zero-Knowledge Guarantee: The Master Password and DEK are NEVER transmitted over the wire or stored on server.",
            "Server receives only BCrypt-hashed Auth Hash and pre-encrypted vault payloads."
        });

        createCard(slide, 495, 105, 425, 375, "⚡ AES-256-GCM Vault Encryption", new String[]{
            "Authenticated AES-GCM Mode ensures both confidentiality and tamper-proof payload integrity.",
            "Unique 12-Byte IV (Initialization Vector) generated per vault item to prevent ciphertext pattern analysis.",
            "Stores items as base64-encoded payload + initialization vector in relational database.",
            "Client decrypts credentials on-the-fly inside local browser RAM memory upon authorized user access."
        });
    }

    // SLIDE 5: Multi-Category Vault Management & Granular Sharing
    private static void createSlide5(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "VAULT MANAGEMENT", "Multi-Category Credential Storage & Granular Sharing", 5);

        createCard(slide, 40, 105, 425, 375, "🗂️ Multi-Category Organization", new String[]{
            "Logins: Secure storage of Web App credentials, OAuth tokens, URLs, usernames, and passwords.",
            "Credit Cards: Financial details including Card Number, CVV, Expiry Date, Cardholder Name, and PIN.",
            "Secure Notes: Encrypted text records for API keys, server SSH secrets, recovery codes, and notes.",
            "Personal Identity: Passports, SSN / Aadhaar numbers, driver licenses, and private records.",
            "Smart Search & Favorites: Instant search filter, category toggling, and top favorite pinning."
        });

        createCard(slide, 495, 105, 425, 375, "🤝 Granular Access & Permission Levels", new String[]{
            "VIEW Permission: Read-only access to view decrypted credential details without modification rights.",
            "EDIT Permission: Update credentials, notes, and metadata while preventing record deletion.",
            "ADMIN Permission: Full operational control including updates, deletion, and sharing permission management.",
            "Audit Trail: Detailed logging of all share invitations, permission changes, and item access events."
        });
    }

    // SLIDE 6: Email OTP Two-Factor Verification & Auth Workflows
    private static void createSlide6(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "AUTHENTICATION FLOWS", "Email OTP Verification & JWT Authentication", 6);

        createCard(slide, 40, 105, 425, 375, "📧 Email OTP Two-Factor Workflow", new String[]{
            "Registration Verification: 6-digit numeric OTP sent via Spring Mail / Resend API before account creation.",
            "Time-Limited Expiry: Cryptographically generated OTP expires in 5 minutes to prevent replay attacks.",
            "Secure Password Reset: Mandatory OTP validation required before permitting master password modification.",
            "Mail Deliverability: HTML-formatted responsive email templates for high inbox deliverability."
        });

        createCard(slide, 495, 105, 425, 375, "🔑 Stateless JWT & Session Security", new String[]{
            "Stateless Authentication: Signed JWT tokens containing User ID, Username, and expiration timestamps.",
            "Custom Security Filter: JwtAuthenticationFilter intercepts every request and validates signature.",
            "User Salt Delivery: On successful authentication, server returns JWT along with the user's unique salt.",
            "Immediate Revocation: Client-side session teardown and server-side log invalidation on logout."
        });
    }

    // SLIDE 7: Password Health Engine & Real-Time Breach Analytics
    private static void createSlide7(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "SECURITY AUDITING", "Password Health Engine & Breach Analytics", 7);

        createCard(slide, 40, 105, 425, 375, "📊 Health Score Calculation Engine", new String[]{
            "Overall Health Score (0-100%): Dynamic aggregation based on entropy, length, uniqueness, and age.",
            "Weak Password Detector: Identifies credentials with insufficient length (<12 chars) or simple character sets.",
            "Duplicate Password Warning: Highlights reused passwords across multiple accounts to eliminate domino breaches.",
            "Old / Stale Credential Tracker: Flags items unchanged for over 90 days for routine rotation."
        });

        createCard(slide, 495, 105, 425, 375, "🎲 Custom Password Generator", new String[]{
            "High Entropy Generator: Generates cryptographically strong random passwords up to 64 characters.",
            "Custom Character Toggles: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), and Special Symbols (!@#$%).",
            "Avoid Ambiguous Characters: Option to exclude easily confused characters (e.g. 0, O, l, 1, I).",
            "Instant Copy & Vault Save: One-click copy to clipboard with auto-clear memory buffer."
        });
    }

    // SLIDE 8: Security Audit Logging & Suspicious Activity Alerts
    private static void createSlide8(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "THREAT MONITORING", "Security Audit Logging & Suspicious Activity Alerts", 8);

        createCard(slide, 40, 105, 425, 375, "🛡️ Comprehensive Security Audit Logs", new String[]{
            "Full Login Activity Logs: Captures timestamp, authentication status (SUCCESS / FAILURE), IP address, and User-Agent.",
            "Device & Location Parsing: Identifies browser name, OS, device type (Desktop/Mobile), and IP origin.",
            "Audit Trail Retention: Clean persistent storage in database with user capabilities to clear or inspect logs.",
            "Non-Repudiation: Every vault modification and login attempt generates an unalterable audit log entry."
        });

        createCard(slide, 495, 105, 425, 375, "🚨 Suspicious Activity & Real-Time Alerts", new String[]{
            "Failed Login Counter: Triggers alerts after repeated invalid authentication attempts.",
            "Unfamiliar Device / Location Alerts: Flags logins originating from unrecognized browsers or new IP addresses.",
            "Interactive Notification Center: Dashboard bell icon displaying unread alerts with mark-as-read toggles.",
            "Risk Escalation: Instant visual warning banners when suspicious login patterns are detected."
        });
    }

    // SLIDE 9: Exportable PDF Reports & DevOps Setup
    private static void createSlide9(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "REPORTS & DEPLOYMENT", "Automated PDF Reporting & Containerized DevOps", 9);

        createCard(slide, 40, 105, 425, 375, "📄 OpenPDF Security Report Generator", new String[]{
            "Password Health PDF: Downloadable structured report containing overall score, weak item breakdown, and recommendations.",
            "Login Audit History PDF: Formal report documenting detailed login sessions, IP addresses, and device metadata.",
            "Executive Styling: Navy and Indigo vector headers, tabular pagination, and custom HeaderFooterPageEvent handler.",
            "On-Demand Generation: Dynamic byte-stream streaming directly to client browser via Spring REST endpoints."
        });

        createCard(slide, 495, 105, 425, 375, "🐳 Docker & Cloud Deployment", new String[]{
            "Multi-Container Architecture: Orchestrated via docker-compose.yml (PostgreSQL + Spring Boot + React/Nginx).",
            "Production Nginx Proxy: Nginx web server serving Vite frontend build and proxying /api REST requests to backend.",
            "Environment Isolation: Production secrets, JWT signing keys, and DB credentials injected via .env files.",
            "Cross-Platform Support: Runs seamlessly on AWS EC2, Azure VMs, Docker Desktop, or Linux enterprise servers."
        });
    }

    // SLIDE 10: Future Roadmap & Project Conclusion
    private static void createSlide10(XMLSlideShow ppt) {
        XSLFSlide slide = createBaseSlide(ppt, "FUTURE ROADMAP & CONCLUSION", "Strategic Future Roadmap & Project Conclusion", 10);

        createCard(slide, 40, 105, 425, 375, "🚀 Strategic Future Roadmap", new String[]{
            "Browser Extension & Mobile App: Native Chrome / Firefox extension and React Native mobile companion.",
            "WebAuthn / FIDO2 Integration: Hardware security key support (YubiKey) and TouchID / FaceID biometric auth.",
            "HaveIBeenPwned API Integration: Live dark web monitoring for instant leak notification on saved accounts.",
            "Enterprise Organization Vaults: Team vault sharing, shared access policies, and central admin dashboard."
        });

        createCard(slide, 495, 105, 425, 375, "🎯 Project Conclusion", new String[]{
            "Enterprise Security Standard: Successfully achieves Zero-Knowledge privacy with client-side AES-256-GCM encryption.",
            "Full Stack Excellence: Robust Java Spring Boot REST backend paired with a high-performance React glassmorphism UI.",
            "Production Ready: Containerized, fully tested, audited, and ready for cloud deployment.",
            "Educational & Enterprise Value: Demonstrates industry best practices in modern cryptography and full-stack architecture."
        });
    }

    // Standalone main method to test and generate presentation directly
    public static void main(String[] args) {
        String outputPath = "Password_Vault_Credential_System_Presentation.pptx";
        try (FileOutputStream fos = new FileOutputStream(outputPath)) {
            generatePresentation(fos);
            System.out.println("SUCCESS: PowerPoint Presentation successfully generated at: " + outputPath);
        } catch (Exception e) {
            logger.error("Failed to generate presentation", e);
        }
    }
}
