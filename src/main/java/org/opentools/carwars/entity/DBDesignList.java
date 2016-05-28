package org.opentools.carwars.entity;

import javax.persistence.*;
import java.util.List;

/**
 * Created by ammulder on 5/27/16.
 */
@Entity
@Table(name = "design_lists")
public class DBDesignList {
    @Id
    private int id;
    private String name;
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner")
    private DBCarWarsUser owner;
    @ManyToMany(mappedBy = "onLists")
    private List<DBCarDesign> designs;
}
