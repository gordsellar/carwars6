package org.opentools.carwars.rest;

import org.opentools.carwars.dao.CarWarsDB;
import org.opentools.carwars.data.DesignRatings;
import org.opentools.carwars.data.DesignRepository;
import org.opentools.carwars.data.RatingRepository;
import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.opentools.carwars.entity.DBDesignRating;
import org.opentools.carwars.entity.DBDesignTag;
import org.opentools.carwars.json.Review;
import org.opentools.carwars.json.SearchStockCarRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.opentools.carwars.config.AllowedText.cleanse;

/**
 * Functions for stock cars
 */
@RestController
public class StockCarController {
    @Autowired
    private CarWarsDB db;
    @Autowired
    private DesignRepository designs;
    @Autowired
    private RatingRepository ratings;
    @Autowired
    private UserRepository users;

    @RequestMapping(value = "/stock/latest", method = RequestMethod.GET)
    public Map getLatest(Authentication user) {
        Map result = new HashMap();
        result.put("designs", db.getLatestStockCars(user == null ? null : user.getName()));
        return result;
    }

    @RequestMapping(value = "/stock/search/{name}", method = RequestMethod.GET)
    public Map getPublicByName(@PathVariable String name, @RequestParam(required = false) String offset, Authentication user) {
        int off = 0;
        if(offset != null) off = Integer.parseInt(offset);
        Map result = new HashMap();
        List<Map> cars = db.getPublicCarsByName(cleanse(name, 30), off, user == null ? null : user.getName());
        boolean more = false;
        if(cars.size() > 20) {
            more = true;
            cars.remove(cars.size()-1);
        }
        result.put("designs", cars);
        result.put("more", more);
        return result;
    }

    @RequestMapping(value = "/stock/search", method = RequestMethod.POST)
    public Map searchStockCars(@RequestBody SearchStockCarRequest request, Authentication user) {
        Map result = new HashMap();
        List<Map> cars = db.searchStockCars(request, user == null ? null : user.getName());
        boolean more = false;
        if(cars.size() > 20) {
            more = true;
            cars.remove(cars.size()-1);
        }
        result.put("designs", cars);
        result.put("more", more);
        return result;
    }

    @RequestMapping(value = "/secure/stock/rating/{designId}", method = RequestMethod.POST)
    public ResponseEntity<DesignRatings> rateStockCar(@RequestBody Review review, Authentication user, @PathVariable long designId) {
        // Clean up data
        if(review.getRating() != null && review.getRating() == 0) review.setRating(null);
        if(review.getComments() != null) {
            review.setComments(review.getComments().trim());
            if(review.getComments().equals("")) review.setComments(null);
            else review.setComments(cleanse(review.getComments(), 2000));
        }
        for (int i = 0; i < review.getTags().size(); i++) {
            review.getTags().set(i, cleanse(review.getTags().get(i), 20));
        }
        DBCarDesign design = designs.findFirstByUiId(designId);
        if(design == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(design.getAuthorEmail() != null && design.getAuthorEmail().equalsIgnoreCase(user.getName())) {
            review.setRating(null); // Don't allow the author to rate their own design
        }
        DBCarWarsUser cwUser = users.findOne(user.getName());
        if(cwUser == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // Save
        DBDesignRating rating = ratings.getRatingForCar(user.getName(), designId);
        if(rating != null) {
            if(review.getRating() == null && review.getComments() == null)
                ratings.delete(rating);
            else {
                rating.setRating(review.getRating());
                rating.setComments(review.getComments());
                ratings.save(rating);
            }
        } else if(review.getRating() != null && review.getComments() != null){
            rating = new DBDesignRating();
            rating.setComments(review.getComments());
            rating.setRating(review.getRating());
            rating.setDesign(design);
            rating.setUser(cwUser);
            ratings.save(rating);
        }
        ratings.deleteTags(user.getName(), designId);
        for (String tag : review.getTags()) {
            DBDesignTag dbt = new DBDesignTag();
            dbt.setUser(cwUser);
            dbt.setDesign(design);
            dbt.setTag(tag);
            db.saveTag(dbt);
        }
        // Get updated statistics
        DesignRatings result = new DesignRatings();
        result.average = ratings.getAverageRating(designId);
        result.tags = designs.getTagsForDesign(designId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
