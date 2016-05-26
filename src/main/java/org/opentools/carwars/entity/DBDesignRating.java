package org.opentools.carwars.entity;

import javax.persistence.*;

/**
 * JPA entity for design ratings
 */
@Entity
@Table(name="design_ratings")
public class DBDesignRating {
    @Id
    private int id;
    @Column(columnDefinition = "tinyint")
    private int rating;
    @Column(columnDefinition = "text")
    private String comments;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user")
    private DBCarWarsUser user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="design_id")
    private DBCarDesign design;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public DBCarWarsUser getUser() {
        return user;
    }

    public void setUser(DBCarWarsUser user) {
        this.user = user;
    }

    public DBCarDesign getDesign() {
        return design;
    }

    public void setDesign(DBCarDesign design) {
        this.design = design;
    }
}
