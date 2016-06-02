package org.opentools.carwars.rest;

import org.opentools.carwars.config.PasswordConfig;
import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Some common functions
 */
public class BaseController {
    @Autowired
    protected PasswordConfig passwords;
    @Autowired
    protected UserRepository users;

    protected DBCarWarsUser createUserRecord(String email, String name, String password) {
        String key = passwords.createConfirmationKey();
        DBCarWarsUser user = new DBCarWarsUser();
        user.setEmail(email);
        user.setName(name);
        user.setConfirmationKey(key);
        user.setConfirmed(false);
        user.setRole("User");
        if(password != null && !password.equals(""))
            user.setPassword(passwords.createNewPassword(password));
        return users.save(user);
    }
}
