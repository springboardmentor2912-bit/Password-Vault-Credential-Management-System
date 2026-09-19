package com.securevault.backend.dto;

public class PasswordHealthResponse {

    private long totalCredentials;

    private long strongPasswords;

    private long mediumPasswords;

    private long weakPasswords;

    private double strongPercentage;

    private double mediumPercentage;

    private double weakPercentage;

    private double healthScore;


    public PasswordHealthResponse() {
    }


    public PasswordHealthResponse(
            long totalCredentials,
            long strongPasswords,
            long mediumPasswords,
            long weakPasswords,
            double strongPercentage,
            double mediumPercentage,
            double weakPercentage,
            double healthScore) {

        this.totalCredentials = totalCredentials;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;

        this.strongPercentage = strongPercentage;
        this.mediumPercentage = mediumPercentage;
        this.weakPercentage = weakPercentage;

        this.healthScore = healthScore;
    }


    public long getTotalCredentials() {
        return totalCredentials;
    }

    public void setTotalCredentials(long totalCredentials) {
        this.totalCredentials = totalCredentials;
    }


    public long getStrongPasswords() {
        return strongPasswords;
    }

    public void setStrongPasswords(long strongPasswords) {
        this.strongPasswords = strongPasswords;
    }


    public long getMediumPasswords() {
        return mediumPasswords;
    }

    public void setMediumPasswords(long mediumPasswords) {
        this.mediumPasswords = mediumPasswords;
    }


    public long getWeakPasswords() {
        return weakPasswords;
    }

    public void setWeakPasswords(long weakPasswords) {
        this.weakPasswords = weakPasswords;
    }


    public double getStrongPercentage() {
        return strongPercentage;
    }

    public void setStrongPercentage(double strongPercentage) {
        this.strongPercentage = strongPercentage;
    }


    public double getMediumPercentage() {
        return mediumPercentage;
    }

    public void setMediumPercentage(double mediumPercentage) {
        this.mediumPercentage = mediumPercentage;
    }


    public double getWeakPercentage() {
        return weakPercentage;
    }

    public void setWeakPercentage(double weakPercentage) {
        this.weakPercentage = weakPercentage;
    }


    public double getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(double healthScore) {
        this.healthScore = healthScore;
    }
}