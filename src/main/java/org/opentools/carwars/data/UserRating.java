package org.opentools.carwars.data;

/**
 * Holds rating information as well as the user who made the rating
 */
public class UserRating {
    private int designId;
    private String email;
    private String name;
    private String comments;
    private Integer rating;

    public UserRating(int designId, String email, String name, String comments, Integer rating) {
        this.designId = designId;
        this.email = email;
        this.name = name;
        this.comments = comments;
        this.rating = rating;
    }

    public int getDesignId() {
        return designId;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getComments() {
        return comments;
    }

    public Integer getRating() {
        return rating;
    }
}
