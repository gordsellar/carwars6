package org.opentools.carwars.entity;

import org.opentools.carwars.data.DesignHistory;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * A car design as stored in the database
 */
@Entity
@Table(name = "designs")
@NamedQueries({
        @NamedQuery(name = "Design.latestStock", query = "select d from DBCarDesign d where d.stockCar=true " +
                "and d.reviewed=true and d.hidden=false order by d.stockUpdateDate desc"),
        @NamedQuery(name = "Design.publicByName", query = "select d from DBCarDesign d where d.stockCar=true " +
                "and d.hidden=false and d.designName like ?1 order by d.cost asc")
})
public class DBCarDesign implements DesignHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "ui_id")
    private long uiId;
    @Column(name = "author_name")
    private String authorName;
    @Column(name = "author_email")
    private String authorEmail;
    @Column(name = "design_name")
    private String designName;
    @Column(name = "design_json", columnDefinition = "TEXT")
    private String designJson;
    private String body;
    private int cost;
    private int weight;
    @Column(name = "stock_car")
    private boolean stockCar;
    @Column(name = "based_on_design_id")
    private Integer basedOnDesignId;
    private boolean reviewed;
    private boolean deferred;
    @Column(name = "create_date")
    private Date createDate;
    @Column(name = "aada_legal")
    private Boolean aadaLegal;
    private boolean hidden;
    private Integer hc;
    private String acceleration;
    @Column(name = "top_speed")
    private BigDecimal topSpeed;
    @Column(name = "tech_level")
    private String techLevel;
    @Column(columnDefinition = "TEXT")
    private String summary;
    private String signature;
    private String credit;
    private String reviewer;
    private String vehicle;
    private String encumbrance;
    @Column(name = "cargo_space")
    private BigDecimal cargoSpace;
    @Column(name = "cargo_weight")
    private Integer cargoWeight;
    @Column(name = "stock_update_date")
    private Date stockUpdateDate;
    private Integer passengers;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "design")
    private Collection<DBDesignRating> ratings;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "design")
    private Collection<DBDesignTag> tags;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "design_list_designs",
            joinColumns = @JoinColumn(name = "design_id"),
            inverseJoinColumns = @JoinColumn(name = "design_list_id"))
    private List<DBDesignList> onLists;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getUiId() {
        return uiId;
    }

    public void setUiId(long uiId) {
        this.uiId = uiId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getDesignName() {
        return designName;
    }

    public void setDesignName(String designName) {
        this.designName = designName;
    }

    public String getDesignJson() {
        return designJson;
    }

    public void setDesignJson(String designJson) {
        this.designJson = designJson;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public boolean isStockCar() {
        return stockCar;
    }

    public void setStockCar(boolean stockCar) {
        this.stockCar = stockCar;
    }

    public Integer getBasedOnDesignId() {
        return basedOnDesignId;
    }

    public void setBasedOnDesignId(Integer basedOnDesignId) {
        this.basedOnDesignId = basedOnDesignId;
    }

    public boolean isReviewed() {
        return reviewed;
    }

    public void setReviewed(boolean reviewed) {
        this.reviewed = reviewed;
    }

    public boolean isDeferred() {
        return deferred;
    }

    public void setDeferred(boolean deferred) {
        this.deferred = deferred;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Boolean getAadaLegal() {
        return aadaLegal;
    }

    public void setAadaLegal(Boolean aadaLegal) {
        this.aadaLegal = aadaLegal;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public Integer getHc() {
        return hc;
    }

    public void setHc(Integer hc) {
        this.hc = hc;
    }

    public String getAcceleration() {
        return acceleration;
    }

    public void setAcceleration(String acceleration) {
        this.acceleration = acceleration;
    }

    public BigDecimal getTopSpeed() {
        return topSpeed;
    }

    public void setTopSpeed(BigDecimal topSpeed) {
        this.topSpeed = topSpeed;
    }

    public String getTechLevel() {
        return techLevel;
    }

    public void setTechLevel(String techLevel) {
        this.techLevel = techLevel;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getCredit() {
        return credit;
    }

    public void setCredit(String credit) {
        this.credit = credit;
    }

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public String getEncumbrance() {
        return encumbrance;
    }

    public void setEncumbrance(String encumbrance) {
        this.encumbrance = encumbrance;
    }

    public BigDecimal getCargoSpace() {
        return cargoSpace;
    }

    public void setCargoSpace(BigDecimal cargoSpace) {
        this.cargoSpace = cargoSpace;
    }

    public Integer getCargoWeight() {
        return cargoWeight;
    }

    public void setCargoWeight(Integer cargoWeight) {
        this.cargoWeight = cargoWeight;
    }

    public Date getStockUpdateDate() {
        return stockUpdateDate;
    }

    public void setStockUpdateDate(Date stockUpdateDate) {
        this.stockUpdateDate = stockUpdateDate;
    }

    public Integer getPassengers() {
        return passengers;
    }

    public void setPassengers(Integer passengers) {
        this.passengers = passengers;
    }

    public Collection<DBDesignRating> getRatings() {
        return ratings;
    }

    public void setRatings(Collection<DBDesignRating> ratings) {
        this.ratings = ratings;
    }

    public Collection<DBDesignTag> getTags() {
        return tags;
    }

    public void setTags(Collection<DBDesignTag> tags) {
        this.tags = tags;
    }
}
