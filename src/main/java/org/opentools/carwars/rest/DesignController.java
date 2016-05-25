package org.opentools.carwars.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Map;

/**
 * Loads and saves vehicle designs
 */
@RestController
public class DesignController {
    @Autowired
    private DesignRepository designs;

    @RequestMapping(value = "/designs/{designId}", method = RequestMethod.GET)
    public ResponseEntity<Map> getDesign(@PathVariable String designId) {
        Authentication user = SecurityContextHolder.getContext().getAuthentication();
        try {
            DBCarDesign saved = designs.findFirstByUiId(new Long(designId));
            Map design = new ObjectMapper().readValue(saved.getDesignJson(), Map.class);
            if(user != null && user.getName() != null) {
                //TODO: design history
                //design.history = [{id,name,date}...] order by create_date desc
                design.put("signature", saved.getSignature());
                design.put("designer_name", saved.getAuthorName());
                // TODO: "designer_comments" = select comments from design_ratings where design_id=? and user=?
                // TODO: extra fields that show for admins only
//                design['author_name'] = author_name
//                design['author_email'] = email
//                design['saved_cost'] = line[7].to_f
//                design['saved_weight'] = line[8].to_f
//                design['saved_cargo_space'] = line[9].to_f
//                design['saved_cargo_weight'] = line[10].to_f
//                design['stock_car'] = (line[11] == '1' || line[11] == 1) && (line[12] == '1' || line[12] == 1) && (line[13] == '0' || line[13] == 0)
//                design['public']
            }
            design.put("stock_tech_level", saved.getTechLevel());
            // TODO: design.tags = [{tag, count}...]  select tag, count(*) from design_tags where design_id=? group by tag
            return new ResponseEntity<>(design, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
