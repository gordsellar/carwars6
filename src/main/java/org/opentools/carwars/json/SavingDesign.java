package org.opentools.carwars.json;

import java.math.BigDecimal;
import java.util.List;

/**
 * The format for a request to save a design
 */
public class SavingDesign {
    public long id;
    public String body_type;
    public int cost;
    public int weight;
    public BigDecimal top_speed;
    public int hc;
    public String acceleration;
    public String tech_level;
    public String designer_credit;
    public String designer_signature;
    public String designer_notes;
    public String vehicle;
    public BigDecimal cargo_space;
    public Integer cargo_weight;
    public int passengers;
    public String encumbrance;
    public List<String> tags;
    public String author_name;
    public String author_email;
    public String design_name;
    public boolean stock_car;
    public String image;
    public String summary;
    public String design_data;
}
