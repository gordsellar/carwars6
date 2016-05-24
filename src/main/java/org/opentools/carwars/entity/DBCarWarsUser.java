package org.opentools.carwars.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * The DB user records
 */
@Entity
@Table(name = "car_wars_users")
public class DBCarWarsUser {
    @Id
    private String email;
    private String name;
    private String password;
    @Column(name = "confirmation_key")
    private String confirmationKey;
    private boolean confirmed;
    @Column(name = "design_signature")
    private String designSignature;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmationKey() {
        return confirmationKey;
    }

    public void setConfirmationKey(String confirmationKey) {
        this.confirmationKey = confirmationKey;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    public String getDesignSignature() {
        return designSignature;
    }

    public void setDesignSignature(String designSignature) {
        this.designSignature = designSignature;
    }
}
