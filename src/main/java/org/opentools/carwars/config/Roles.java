package org.opentools.carwars.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

/**
 * Deals with user roles
 */
public class Roles {
    public final static String ADMIN = "Admin";
    public final static String OWNER = "Owner";
    public final static String USER = "User";

    public static boolean isAdmin(Authentication auth) {
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if(authority.getAuthority().equals(ADMIN) || authority.getAuthority().equals(OWNER))
                return true;
        }
        return false;
    }

    public static boolean isOwner(Authentication auth) {
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if(authority.getAuthority().equals(OWNER))
                return true;
        }
        return false;
    }
}
