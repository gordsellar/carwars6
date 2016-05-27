package org.opentools.carwars.rest;

import org.opentools.carwars.dao.CarWarsDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

    @RequestMapping(value = "/latest", method = RequestMethod.GET)
    public Map getLatest(Authentication user) {
        Map result = new HashMap();
        result.put("designs", db.getLatestStockCars(user == null ? null : user.getName()));
        return result;
    }
}
