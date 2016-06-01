package org.opentools.carwars.rest;

import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.opentools.carwars.json.AccountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import static org.opentools.carwars.config.AllowedText.cleanse;

/**
 * Controller for calls related to an account
 * except for login/logout which are handled by the security system
 */
@Controller
public class AccountController {
    @Autowired
    private UserRepository users;
    private ShaPasswordEncoder sha = new ShaPasswordEncoder(256);

    public AccountController() {
        sha.setEncodeHashAsBase64(true);
    }

    @RequestMapping(value = "/beginAccount", method = RequestMethod.POST)
    public ResponseEntity beginAccount(@RequestBody AccountRequest request) {
        request.email = cleanse(request.email, 50);
        DBCarWarsUser user = users.findOne(request.email);
        if(user == null) {
            String key = createUserRecord(request.email, "", null);
            sendAccountEmail(request.email, "", key);
        } else {
            if(user.isConfirmed()) return new ResponseEntity(HttpStatus.FORBIDDEN);
            sendAccountEmail(request.email, user.getName(), user.getConfirmationKey());
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    private void sendAccountEmail(String email, String name, String key) {
        // TODO
    }

    protected synchronized String createConfirmationKey() {
        String prefix = System.getenv("CARWARS_CONFIRMATION_PREFIX");
        String key = sha.encodePassword(prefix+Math.random(), null);
        return key.replace("/", "4").replace("+", "F");
    }

    protected synchronized String encodeNewPassword(String original) {
        return null;  // TODO
    }

    protected String createUserRecord(String email, String name, String password) {
        String key = createConfirmationKey();
        DBCarWarsUser user = new DBCarWarsUser();
        user.setEmail(email);
        user.setName(name);
        user.setConfirmationKey(key);
        user.setConfirmed(false);
        user.setPassword(encodeNewPassword(password));
        users.save(user);
        return key;
    }
}
