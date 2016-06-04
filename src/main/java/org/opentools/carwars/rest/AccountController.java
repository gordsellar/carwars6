package org.opentools.carwars.rest;

import org.opentools.carwars.config.WebLoginSuccess;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.opentools.carwars.json.AccountRequest;
import org.opentools.carwars.json.PendingUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.opentools.carwars.config.AllowedText.cleanse;

/**
 * Controller for calls related to an account
 * except for login/logout which are handled by the security system
 */
@RestController
public class AccountController extends BaseController {
    @Autowired
    private WebLoginSuccess cookieHandler;

    @RequestMapping(value="/checkLogin", method = RequestMethod.GET)
    public void checkLoginStatus(Authentication auth, HttpServletResponse response) {
        if(auth == null || auth.getName() == null) {
            cookieHandler.clearCookies(response);
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @RequestMapping(value = "/beginAccount", method = RequestMethod.POST)
    public ResponseEntity beginAccount(@RequestBody AccountRequest request) {
        request.email = cleanse(request.email, 50);
        DBCarWarsUser user = users.findOne(request.email);
        if(user == null) {
            String key = createUserRecord(request.email, "", null).getConfirmationKey();
            mailer.sendAccountEmail(request.email, "", key);
        } else {
            if(user.isConfirmed()) return new ResponseEntity(HttpStatus.FORBIDDEN);
            mailer.sendAccountEmail(request.email, user.getName(), user.getConfirmationKey());
        }
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value="/confirm", method = RequestMethod.POST)
    public ResponseEntity<PendingUser> findUnconfirmedUser(@RequestBody AccountRequest request) {
        DBCarWarsUser user = users.getUnconfirmedUser(request.key);
        if(user == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        PendingUser result = new PendingUser();
        result.name = user.getName();
        result.email = user.getEmail();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequestMapping(value="/createAccount", method = RequestMethod.POST)
    public ResponseEntity activateAccount(@RequestBody AccountRequest request, HttpServletResponse response, HttpServletRequest hsr) {
        request.name = cleanse(request.name, 30);
        request.email = cleanse(request.email, 50);
        if(request.password == null || request.password.equals("") || request.name == null || request.name.equals("")
                || request.email == null || request.email.equals(""))
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        DBCarWarsUser user = users.getUnconfirmedUser(request.key);
        if(user == null || !user.getEmail().equalsIgnoreCase(request.email))
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        user.setName(request.name);
        user.setPassword(passwords.createNewPassword(request.password));
        user.setConfirmed(true);
        users.save(user);
        try {
            hsr.login(request.email, request.password);
        } catch (ServletException e) {
            System.err.println("Failed to auto log in: "+e.getMessage());
        }
        cookieHandler.setCookies(response, user);
        return new ResponseEntity(HttpStatus.OK);
    }

    @RequestMapping(value="/resetPassword", method = RequestMethod.POST)
    public ResponseEntity resetPassword(@RequestBody AccountRequest request) {
        request.email = cleanse(request.email, 50);
        DBCarWarsUser user = users.findOne(request.email);
        if(user == null) {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
        user.setConfirmed(false);
        user.setConfirmationKey(passwords.createConfirmationKey());
        users.save(user);
        mailer.sendResetEmail(request.email, user.getName(), user.getConfirmationKey());
        return new ResponseEntity(HttpStatus.OK);
    }

}
