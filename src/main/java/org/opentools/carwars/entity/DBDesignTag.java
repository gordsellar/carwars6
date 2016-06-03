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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "design_id")
    private DBCarDesign design;
    private String email;
    @Id
    private String tag;

    public DBCarDesign getDesign() {
        return design;
    }

    public void setDesign(DBCarDesign design) {
        this.design = design;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
