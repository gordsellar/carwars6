package org.opentools.carwars.json;

/**
 * The JSON API format for a car design
 */
public class CarDesign {
    private String name;
    private String authorEmail;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }
}
