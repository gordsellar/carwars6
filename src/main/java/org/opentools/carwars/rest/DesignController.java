package org.opentools.carwars.rest;

import org.opentools.carwars.dao.CarWarsDB;
import org.opentools.carwars.data.DesignRepository;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.json.CarDesign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * Loads and saves vehicle designs
 */
@RestController
public class DesignController {
    @Autowired
    private DesignRepository designs;

    @RequestMapping(value = "/designs/{designId}", method = RequestMethod.GET)
    public ResponseEntity<CarDesign> getDesign(@PathVariable String designId) {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        try {
            DBCarDesign saved = designs.findFirstByUiId(new Long(designId));
            CarDesign foo = new CarDesign();
            foo.setName(saved.getDesignName());
            foo.setAuthorEmail(saved.getAuthorEmail());
            return new ResponseEntity<CarDesign>(foo, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<CarDesign>(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(value = "/secure/designs")
    public List<CarDesign> listUserDesigns() {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        List<DBCarDesign> list = designs.findByAuthorEmail(user.getName());
        List<CarDesign> out = new ArrayList<>(list.size());
        for (DBCarDesign design : list) {
            out.add(CarDesign.forList(design));
        }
        return out;
    }
}
