package org.opentools.carwars.json;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * A JSON request to generate a PDF document
 */
public class PDFRequest {
    public String summary;
    public boolean legal;
    public String draw;
    public List<Armor> armor = new ArrayList<>();
    public List<Weapon> weapons = new ArrayList<>();
    public List<Line> worksheet = new ArrayList<>();
    public String walkaround;
    public Statistics statistics;

    public static class Armor {
        public String location;
        public String value;
    }
    public static class Weapon {
        public String weapon;
        public String ammo;
        public String toHit;
        public String damage;
        public Integer fireModifier;
        public Integer burnDuration;
    }
    public static class Line {
        public String name;
        public BigDecimal cost;
        public BigDecimal weight;
        public BigDecimal space;
        public Integer maxWeight;
        public Integer maxSpace;
        public boolean vehicularSpace;
        public boolean cargo;
        public Integer ge;
        public Boolean ignoreWeight;
    }
    public static class Statistics {
        public int version;
        public String techLevel;
        public String name;
        public String body;
        public String chassis;
        public String suspension;
        public String cost;
        public int weight;
        public String topSpeed;
        public String acceleration;
        public String loadedTopSpeed;
        public String loadedAcceleration;
        public String handlingClass;
        public BigDecimal cargoSpace;
        public BigDecimal cargoWeight;
        public boolean useGE;
        public List<String> crew;
        public int passengers;
        public String range;
        public Long save_id;
        public Long stock_id;
        public BigDecimal sidecarCargoSpace;
        public Integer sidecarCargoWeight;
    }
}
