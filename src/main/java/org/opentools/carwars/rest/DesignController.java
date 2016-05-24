package org.opentools.carwars.rest;

import org.opentools.carwars.dao.CarWarsDB;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.json.CarDesign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Loads and saves vehicle designs
 */
@RestController
@RequestMapping("/design")
public class DesignController {
    @Autowired
    private CarWarsDB db;

    @RequestMapping(value = "/{designId}", method = RequestMethod.GET)
    public ResponseEntity<CarDesign> getDesign(@PathVariable String designId) {
        try {
            DBCarDesign saved = db.getDesign(Long.parseLong(designId));
            CarDesign foo = new CarDesign();
            foo.setName(saved.getDesignName());
            foo.setAuthorEmail(saved.getAuthorEmail());
            return new ResponseEntity<CarDesign>(foo, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<CarDesign>(HttpStatus.NOT_FOUND);
        }
    }
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public CarDesign testDesign() {
        CarDesign foo = new CarDesign();
        foo.setName("Killer");
        foo.setAuthorEmail("ammulder@gmail.com");
        return foo;
    }
}
