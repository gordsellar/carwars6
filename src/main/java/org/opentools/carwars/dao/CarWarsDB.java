package org.opentools.carwars.dao;

import org.opentools.carwars.data.TagCount;
import org.opentools.carwars.data.UserRating;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBDesignTag;
import org.opentools.carwars.json.Review;
import org.opentools.carwars.json.SearchStockCarRequest;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.opentools.carwars.config.AllowedText.limitSize;

/**
 * Database access for the Car Wars DB
 */
@Repository
@Transactional
public class CarWarsDB {
    @PersistenceContext
    private EntityManager mgr;

    public void saveTag(DBDesignTag tag) {
        mgr.persist(tag);
    }

    public List<Map> getLatestStockCars(String currentUser) {
        List<DBCarDesign> designs = mgr.createNamedQuery("Design.latestStock", DBCarDesign.class)
                .setMaxResults(10).getResultList();
        return populateCarData(designs, currentUser);
    }

    public List<Map> getPendingStockCars(String currentUser) {
        List<DBCarDesign> designs = mgr.createNamedQuery("Design.pendingStock", DBCarDesign.class)
                .setMaxResults(20).getResultList();
        return populateCarData(designs, currentUser);
    }

    public List<Map> getPublicCarsByName(String name, int offset, String currentUser) {
        TypedQuery<DBCarDesign> query = mgr.createNamedQuery("Design.publicByName", DBCarDesign.class)
                .setParameter(1, "%"+name+"%").setMaxResults(21);
        if(offset > 0) query.setFirstResult(offset);
        List<DBCarDesign> designs = query.getResultList();
        return populateCarData(designs, currentUser);
    }

    public List<Map> searchStockCars(SearchStockCarRequest request, String currentUser) {
        StringBuilder buf = new StringBuilder();
        // Step 1: build the query
        int i, index = 0;
        buf.append("select d from DBCarDesign d");
        if(request.getList() == null) buf.append(" where d.stockCar=true and d.reviewed=true and d.hidden=false");
        else buf.append(" join d.onLists l where l.name=?").append(++index);
        if(request.getVehicle() != null && request.getVehicle().size() > 0) {
            buf.append(" and d.vehicle in (");
            for(i=0; i<request.getVehicle().size(); i++) {
                if(i>0) buf.append(",");
                buf.append("?").append(++index);
            }
            buf.append(")");
        }
        if(request.getEncumbrance() != null)
            buf.append(" and (d.encumbrance=?").append(++index).append(" or d.encumbrance is null)");
        if(request.getTechLevel() != null) {
            if(request.getTechLevel().equals("Classic")) buf.append(" and tech_level='Classic'");
            if(request.getTechLevel().equals("CWC")) buf.append(" and tech_level in ('Classic','CWC')");
            if(request.getTechLevel().equals("All")) buf.append(" and tech_level<>'Military'");
        }
        if(request.getTags() != null) {
            for (String tag : request.getTags())
                buf.append(" and exists (select t.id from DBDesignTag t where t.design.id = d.id and t.tag=?").append(++index).append(")");
        }
        buf.append(" order by d.cost asc");
        TypedQuery<DBCarDesign> query = mgr.createQuery(buf.toString(), DBCarDesign.class).setMaxResults(21);
        if(request.getOffset() != 0) query.setFirstResult(request.getOffset());
        // Step 2: fill in parameters
        index = 0;
        if(request.getList() != null) query.setParameter(++index, limitSize(request.getList(), 30));
        if(request.getVehicle() != null && request.getVehicle().size() > 0) {
            for(i=0; i<request.getVehicle().size(); i++) {
                query.setParameter(++index, request.getVehicle().get(i));
            }
        }
        if(request.getEncumbrance() != null) query.setParameter(++index, limitSize(request.getEncumbrance(), 10));
        if(request.getTags() != null) {
            for (String tag : request.getTags())
                query.setParameter(++index, limitSize(tag, 20));
        }
        // Step 3: look up results
        return populateCarData(query.getResultList(), currentUser);
    }

    public List<Map> populateCarData(List<DBCarDesign> designs, String currentUser) {
        List<Map> result = new ArrayList<>();
        StringBuilder ids = new StringBuilder();
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
            if(ids.length() > 0) ids.append(",");
            ids.append(design.getId());
            byId.put(design.getId(), car);
            result.add(car);
            car.put("ratings", new ArrayList());
            car.put("tags", new ArrayList());
        }
        if(result.size() > 0) {
            // Get all the user ratings on the matching designs
            TypedQuery<UserRating> query = mgr.createQuery("select new org.opentools.carwars.data.UserRating(" +
                    "r.design.id, r.user, u.name, r.comments, r.rating) from DBDesignRating r left join DBCarWarsUser u " +
                    "on u.email = r.user where r.design.id in ("+ids+") and (r.comments is not null or r.rating is not null" +
                    (currentUser == null ? "" : " or r.user=?1")+") order by r.id asc", UserRating.class);
            if(currentUser != null) query.setParameter(1, currentUser);
            for (UserRating rating : query.getResultList()) {
                Review rev = new Review();
                rev.setUser(rating.getName() == null ? rating.getEmail() : rating.getName());
                rev.setEmail(rating.getEmail());
                rev.setComments(rating.getComments());
                rev.setRating(rating.getRating());
                Map car = byId.get(rating.getDesignId());
                if(currentUser != null && currentUser.equals(rating.getEmail())) {
                    rev.setCurrent(true);
                    car.put("entry", false);
                } else rev.setCurrent(false);
                ((List)car.get("ratings")).add(rev);
            }
            // Get all the user tags on the matching designs
            TypedQuery<TagCount> q2 = mgr.createQuery("select new org.opentools.carwars.data.TagCount(" +
                    "t.design.id, t.tag, count(t)) from DBDesignTag t where t.design.id in ("+ids+")" +
                    "group by t.design.id, t.tag", TagCount.class);
            for (TagCount tc : q2.getResultList()) {
                Map tag = new HashMap();
                tag.put("tag", tc.getTag());
                tag.put("count", tc.getCount());
                ((List)byId.get(tc.getDesignId()).get("tags")).add(tag);
            }
            // Put the current user's tags into the results
            if(currentUser != null) {
                TypedQuery<TagCount> q3 = mgr.createQuery("select new org.opentools.carwars.data.TagCount(" +
                        "t.design.id, t.tag) from DBDesignTag t where t.design.id in ("+ids+")" +
                        "and t.email=?1", TagCount.class);
                q3.setParameter(1, currentUser);
                for (TagCount tc : q3.getResultList()) {
                    Map car = byId.get(tc.getDesignId());
                    Boolean entry = (Boolean)car.get("entry");
                    if(entry != null && entry) {
                        Review review = new Review();
                        review.setUser(currentUser);
                        review.setEmail(currentUser);
                        review.setCurrent(true);
                        review.getTags().add(tc.getTag());
                        ((List)car.get("ratings")).add(review);
                        car.put("entry", false);
                    } else {
                        for (Review review : (List<Review>) car.get("ratings")) {
                            if(review.getEmail().equals(currentUser))
                                review.getTags().add(tc.getTag());
                        }
                    }
                }
            }
            // Calculate all the average ratings
            for (Map car : result) {
                int total = 0, count = 0;
                for (Review review : (List<Review>) car.get("ratings")) {
                    if(review.getRating() != null) {
                        total += review.getRating();
                        count += 1;
                    }
                }
                if(count > 0) car.put("average_rating", (float)total/(float)count);
            }
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
