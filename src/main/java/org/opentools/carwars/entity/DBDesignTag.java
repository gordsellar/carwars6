package org.opentools.carwars.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Entity for tags in the DB
 */
@Entity
@Table(name = "design_tags")
public class DBDesignTag implements Serializable {
    @Id
    @ManyToOne
    @JoinColumn(name = "design_id")
    private DBCarDesign design;
    @Id
    @ManyToOne
    @JoinColumn(name = "email")
    private DBCarWarsUser user;
    @Id
    private String tag;

    public DBCarDesign getDesign() {
        return design;
    }

    public void setDesign(DBCarDesign design) {
        this.design = design;
    }

    public DBCarWarsUser getUser() {
        return user;
    }

    public void setUser(DBCarWarsUser user) {
        this.user = user;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
