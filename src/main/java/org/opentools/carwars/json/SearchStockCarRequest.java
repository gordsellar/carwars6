package org.opentools.carwars.json;

import java.util.List;

/**
 * JSON request for searching stock cars
 */
public class SearchStockCarRequest {
    private String list;
    private List<String> vehicle;
    private List<String> tags;
    private String techLevel;
    private String encumbrance;
    private int offset;

    public String getList() {
        return list;
    }

    public void setList(String list) {
        this.list = list;
    }

    public List<String> getVehicle() {
        return vehicle;
    }

    public void setVehicle(List<String> vehicle) {
        this.vehicle = vehicle;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getTechLevel() {
        return techLevel;
    }

    public void setTechLevel(String techLevel) {
        this.techLevel = techLevel;
    }

    public String getEncumbrance() {
        return encumbrance;
    }

    public void setEncumbrance(String encumbrance) {
        this.encumbrance = encumbrance;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    @Override
    public String toString() {
        return "SearchStockCarRequest{" +
                "list='" + list + '\'' +
                ", vehicle=" + vehicle +
                ", tags=" + tags +
                ", techLevel='" + techLevel + '\'' +
                ", encumbrance='" + encumbrance + '\'' +
                ", offset=" + offset +
                '}';
    }
}
