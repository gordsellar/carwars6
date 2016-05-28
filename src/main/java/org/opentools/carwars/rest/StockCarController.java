package org.opentools.carwars.rest;

import org.opentools.carwars.dao.CarWarsDB;
import org.opentools.carwars.json.SearchStockCarRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Functions for stock cars
 */
@RestController
public class StockCarController {
    @Autowired
    private CarWarsDB db;

    @RequestMapping(value = "/stock/latest", method = RequestMethod.GET)
    public Map getLatest(Authentication user) {
        Map result = new HashMap();
        result.put("designs", db.getLatestStockCars(user == null ? null : user.getName()));
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
}
