package org.opentools.carwars.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.mail.util.MailConnectException;
import org.opentools.carwars.config.Roles;
import org.opentools.carwars.data.DesignHistory;
import org.opentools.carwars.data.DesignRepository;
import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.opentools.carwars.entity.DBDesignRating;
import org.opentools.carwars.entity.DBDesignTag;
import org.opentools.carwars.json.CarDesign;
import org.opentools.carwars.json.SavingDesign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.ConnectException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.opentools.carwars.config.AllowedText.cleanse;

/**
 * Loads and saves vehicle designs
 */
@RestController
public class DesignController extends BaseController {
    @Autowired
    private DesignRepository designs;
    @Autowired
    private JavaMailSender mailSender;

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
                DBDesignRating rating = designs.getAuthorRating(saved.getUiId());
                design.put("designer_comments", rating == null ? null : rating.getComments());
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
    public List<CarDesign> listUserDesigns(Authentication user) {
        List<DBCarDesign> list = designs.findByAuthorEmail(user.getName());
        List<CarDesign> out = new ArrayList<>(list.size());
        for (DBCarDesign design : list) {
            out.add(CarDesign.forList(design));
        }
        return out;
    }

    @RequestMapping(value = "/secure/designs/delete/{designId}", method = RequestMethod.POST)
    public ResponseEntity deleteDesign(@PathVariable String designId, Authentication user, HttpServletRequest req) {
        long id;
        try {
            id = Long.parseLong(designId);
        } catch (NumberFormatException e) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        DBCarDesign saved = designs.findFirstByUiId(id);
        if((saved.getAuthorEmail() == null || !saved.getAuthorEmail().equalsIgnoreCase(user.getName())) && !req.isUserInRole("Owner")) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        saved.setHidden(true);
        designs.save(saved);
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value = "/designs", method = RequestMethod.POST)
    public ResponseEntity<String> saveDesign(@RequestBody SavingDesign design, HttpServletResponse resp, Authentication auth) throws IOException {
        if(design.author_email != null) {
            design.author_email = cleanse(design.author_email, 51);
            if(design.author_email.length() == 51) design.author_email = null;
        }
        design.author_name = cleanse(design.author_name, 30);
        design.design_name = cleanse(design.design_name, 30);
        design.design_data = design.design_data.replace("<", "&lt;");
        design.body_type = cleanse(design.body_type, 30);
        design.acceleration = cleanse(design.acceleration, 10);
        design.tech_level = cleanse(design.tech_level, 20);
        design.designer_credit = cleanse(design.designer_credit, 100);
        design.designer_signature = cleanse(design.designer_signature, 200);
        design.designer_notes = cleanse(design.designer_notes, 2000);
        design.summary = cleanse(design.summary, 3000);
        design.vehicle = cleanse(design.vehicle, 20);
        design.encumbrance = cleanse(design.encumbrance, 10);
        for (int i = 0; i < design.tags.size(); i++) {
            design.tags.set(i, cleanse(design.tags.get(i), 20));
        }
        DBCarDesign out = new DBCarDesign();
        out.setUiId(design.id);
        out.setAuthorName(design.author_name);
        out.setAuthorEmail(design.author_email);
        out.setDesignName(design.design_name);
        out.setDesignJson(design.design_data);
        out.setBody(design.body_type);
        out.setCost(design.cost);
        out.setWeight(design.weight);
        out.setStockCar(design.stock_car);
        out.setCreateDate(new Date());
        out.setTopSpeed(design.top_speed);
        out.setAcceleration(design.acceleration);
        out.setTechLevel(design.tech_level);
        out.setHc(design.hc);
        out.setCredit(design.designer_credit);
        out.setSignature(design.designer_signature);
        out.setVehicle(design.vehicle);
        out.setCargoSpace(design.cargo_space);
        out.setCargoWeight(design.cargo_weight);
        out.setEncumbrance(design.encumbrance);
        out.setSummary(design.summary);
        out.setPassengers(design.passengers);

        if(design.author_email != null) {
            DBCarWarsUser user = users.findOne(design.author_email);
            if(user != null) {
                if(design.tags != null && design.tags.size() > 0) {
                    out.setTags(new ArrayList<DBDesignTag>());
                    for (String tag : design.tags) {
                        DBDesignTag dt = new DBDesignTag();
                        dt.setDesign(out);
                        dt.setTag(tag);
                        dt.setUser(user);
                        out.getTags().add(dt);
                    }
                }
                if(design.designer_notes != null) {
                    DBDesignRating rating = new DBDesignRating();
                    rating.setUser(user);
                    rating.setDesign(out);
                    rating.setComments(design.designer_notes);
                    out.setRatings(new ArrayList<DBDesignRating>());
                    out.getRatings().add(rating);
                }
                if(design.designer_signature != null) {
                    user.setDesignSignature(design.designer_signature);
                    users.save(user);
                    if(auth != null && auth.getName() != null) {
                        Cookie cookie = new Cookie("author_design_sig", design.designer_signature);
                        cookie.setPath("/");
                        cookie.setMaxAge(86400*30);
                        resp.addCookie(cookie);
                    }
                }
            }
        }
        out = designs.save(out);

        if(design.image != null && design.image.startsWith("data:image/png;base64,")) {
            try {
                File outFile = new File(System.getenv("OPENSTACK_DATA_DIR"), "content/designs/"+design.id+".png");
                InputStream in = MimeUtility.decode(new ByteArrayInputStream(design.image.substring(22).getBytes("US-ASCII")), "base64");
                FileOutputStream fout = new FileOutputStream(outFile);
                byte[] buf = new byte[2048];
                int len;
                while((len = in.read(buf)) > 0) {
                    fout.write(buf, 0, len);
                }
                fout.flush();
                fout.close();
                in.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if(design.author_email != null) {
            designs.hideOldDesigns(design.author_email, design.design_name, design.id);
            sendDesignEmail(design.author_name, design.author_email);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private void sendDesignEmail(final String name, final String email) {
        DBCarWarsUser user = users.findOne(email);
        if(user == null) {
            user = createUserRecord(email, name, null);
        } else if(user.getName().equals("") && name != null && !name.equals("")) {
            user.setName(name);
            users.save(user);
        }
        StringBuilder buf = new StringBuilder();
        buf.append("<h2>Car Designs</h2>\n").append(
                "<p>These are the car designs on record for "+email+":</p>\n").append(
                "<table border='1'>\n").append(
                "  <tr>\n").append(
                "    <th>Name</th>\n").append(
                "    <th>Body</th>\n").append(
                "    <th>Cost</th>\n").append(
                "    <th>Date</th>\n").append(
                "  </tr>\n");
        List<DBCarDesign> list = designs.findLatestByAuthor(email);
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy hh:mm aa");
        for (DesignHistory design : list) {
            buf.append("  <tr><td><a href='http://carwars.opentools.org/load/").append(design.getUiId()).append("'>").append(
                    design.getDesignName()).append("</a></td>").append(
                    "<td>").append(design.getBody()).append("</td><td>$").append(design.getCost()).append("</td><td>").append(
                    sdf.format(design.getCreateDate())).append("</td></tr>\n");
        }
        buf.append("</table>\n");
        if(!user.isConfirmed()) {
            buf.append("\n<p>If you'd like to create an account to load your designs through the UI, <a href='http://carwars.opentools.org/confirm/").append(
                    user.getConfirmationKey()).append("'>click here</a>.</p>");
        }
        buf.append("<p>Happy duelling!</p>\n");

        final String text = buf.toString();
        MimeMessagePreparator mmp = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
                String to = name == null || name.equals("") ? email : name+" <"+email+">";
                message.setTo(to);
                message.setFrom("Car Wars Combat Garage <garage@carwars.opentools.org>");
                message.setSubject("Your Car Design");
                message.setText(text, true);
            }
        };
        try {
            this.mailSender.send(mmp);
        } catch (MailException e) {
            if(e.getCause() instanceof MailConnectException && e.getCause().getCause() instanceof ConnectException &&
                    e.getCause().getMessage().contains("localhost")) {
                System.err.println(text);
            } else {
                e.printStackTrace();
            }
        }
    }
}
