package org.opentools.carwars.json;

import org.opentools.carwars.entity.DBCarDesign;

import java.text.SimpleDateFormat;

/**
 * The JSON API format for a car design
 */
public class CarDesign {
    private long id;
    private String name;
    private String date;
    private String authorEmail;
    private String body;
    private int cost;
    private Boolean aada;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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

    public Boolean getAada() {
        return aada;
    }

    public void setAada(Boolean aada) {
        this.aada = aada;
    }

    public static CarDesign forList(DBCarDesign source) {
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy hh:mmaa");
        CarDesign car = new CarDesign();
        car.id = source.getUiId();
        car.name = source.getDesignName();
        car.date = source.getCreateDate() == null ? null : sdf.format(source.getCreateDate());
        car.authorEmail = source.getAuthorEmail();
        car.body = source.getBody();
        car.cost = source.getCost();
        car.aada = source.getAadaLegal();
        return car;
    }
}
