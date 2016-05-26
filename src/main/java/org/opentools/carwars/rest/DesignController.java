package org.opentools.carwars.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.opentools.carwars.config.Roles;
import org.opentools.carwars.dao.CarWarsDB;
import org.opentools.carwars.data.DesignHistory;
import org.opentools.carwars.data.DesignRepository;
import org.opentools.carwars.data.TagCount;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.json.CarDesign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Loads and saves vehicle designs
 */
@RestController
public class DesignController {
    @Autowired
    private DesignRepository designs;

    @RequestMapping(value = "/designs/{designId}", method = RequestMethod.GET)
    public ResponseEntity<Map> getDesign(@PathVariable String designId, Authentication user) throws IOException {
        List<Map> values;
        DBCarDesign saved = designs.findFirstByUiId(new Long(designId));
        if(saved == null)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        Map design = new ObjectMapper().readValue(saved.getDesignJson(), Map.class);
        if(user != null && user.getName() != null) {
            List<DBCarDesign> history = designs.findHistoricalDesigns(saved.getDesignName(), user.getName(), saved.getCreateDate());
            values = new ArrayList<>();
            for (DesignHistory old : history) {
                Map row = new HashMap();
                row.put("id", old.getUiId());
                row.put("name", old.getDesignName());
                row.put("date", old.getCreateDate());
                values.add(row);
            }
            design.put("history", values);
            if(saved.getAuthorEmail() != null && user.getName().equalsIgnoreCase(saved.getAuthorEmail())) {
                design.put("signature", saved.getSignature());
                design.put("designer_name", saved.getAuthorName());
                design.put("designer_comments", designs.getAuthorRating(saved.getUiId()).getComments());
            }
            if(Roles.isAdmin(user)) {
                design.put("author_name", saved.getAuthorName());
                design.put("author_email", saved.getAuthorEmail());
                design.put("saved_cost", saved.getCost());
                design.put("saved_weight", saved.getWeight());
                design.put("saved_cargo_space", saved.getCargoSpace());
                design.put("saved_cargo_weight", saved.getCargoWeight());
                design.put("stock_car", saved.isStockCar() && saved.isReviewed() && !saved.isHidden());
                design.put("public", saved.isStockCar() && !saved.isHidden());
            }
        }
        design.put("stock_tech_level", saved.getTechLevel());
        design.put("tags", designs.getTagsForDesign(saved.getUiId()));
        return new ResponseEntity<>(design, HttpStatus.OK);
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
