package org.opentools.carwars.dao;

import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Database access for the Car Wars DB
 */
@Repository
@Transactional
public class CarWarsDB {
    @PersistenceContext
    private EntityManager mgr;

    public List<Map> getLatestStockCars(String currentUser) {
        List<DBCarDesign> designs = mgr.createNamedQuery("Design.latestStock", DBCarDesign.class)
                .setMaxResults(10).getResultList();
        return populateCarData(designs, currentUser);
    }

    public List<Map> populateCarData(List<DBCarDesign> designs, String currentUser) {
        List<Map> result = new ArrayList<>();
        List<String> ids = new ArrayList<>();
        Map<Integer, Map> byId = new HashMap<>();
        for (DBCarDesign design : designs) {
            Number speed = isInteger(design.getTopSpeed()) ? design.getTopSpeed().toBigIntegerExact() : design.getTopSpeed();
            Number cargoSpace = isInteger(design.getCargoSpace()) ? design.getCargoSpace().toBigIntegerExact() : design.getCargoSpace();
            Map car = new HashMap();
            car.put("id", design.getUiId());
            car.put("name", design.getDesignName());
            car.put("body", abbreviateBody(design.getBody()));
            car.put("cost", design.getCost());
            car.put("hc", design.getHc());
            car.put("acceleration", design.getAcceleration());
            car.put("top_speed", speed);
            car.put("summary", design.getSummary());
            car.put("tech_level", massageTechLevel(design.getTechLevel()));
            car.put("vehicle", design.getVehicle());
            car.put("aada", design.getAadaLegal());
            car.put("author_name", design.getAuthorName());
            car.put("author_email", design.getAuthorEmail());
            car.put("signature", design.getSignature());
            car.put("cargo_space", cargoSpace);
            car.put("cargo_weight", design.getCargoWeight());
            car.put("weight", design.getWeight());
            car.put("stock_confirmed", design.isReviewed());
            car.put("passengers", design.getPassengers());
            car.put("entry", currentUser != null);
            ids.add(Integer.toString(design.getId()));
            byId.put(design.getId(), car);
            result.add(car);
            car.put("ratings", new ArrayList());
            car.put("tags", new ArrayList());
        }

        return result;
    }
    
    public static String abbreviateBody(String body) {
        if(body.equals("Medium Trike")) return "Med. Trike";
        if(body.equals("Medium Cycle")) return "Med. Cycle";
        if(body.equals("Sleeper Longnose")) return "Slp. Lnose";
        if(body.equals("Station Wagon")) return "St. Wagon";
        if(body.equals("Standard Longnose")) return "Longnose";
        if(body.equals("Standard Cabover")) return "Cabover";
        if(body.equals("Sleeper Cabover")) return "Slp. Cbovr";
        if(body.equals("40\" Dual-Level Flatbed")) return "40' 2xF.bed";
        return body;
    }

    public String massageTechLevel(String original) {
        if(original.equals("All")) return "UACFH/Pyramid";
        if(original.equals("CWC") || original.equals("CWC_2_5")) return "CWC 2.5";
        return original;
    }

    public static boolean isInteger(BigDecimal bd) {
        return bd.signum() == 0 || bd.scale() <= 0 || bd.stripTrailingZeros().scale() <= 0;
    }
}
