package org.opentools.carwars.config;

import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 *
 */
@Component
public class WebLoginSuccess implements AuthenticationSuccessHandler {
    @Autowired
    private UserRepository users;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        DBCarWarsUser user = users.findOne(authentication.getName());
        setCookies(response, user);
        response.setStatus(200);
    }

    public void setCookies(HttpServletResponse response, DBCarWarsUser user) {
        response.addCookie(prepareCookie("author_email", user.getEmail()));
        response.addCookie(prepareCookie("author_design_sig", user.getDesignSignature()));
        response.addCookie(prepareCookie("author_name", user.getName()));
        response.addCookie(prepareCookie("role",  user.getRole()));
    }

    private Cookie prepareCookie(String name, String value) {
        String working;
        if(value != null) {
            try {
                working = URLEncoder.encode(value, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                working = value;
            }
        } else working = null;
        Cookie cookie = new Cookie(name, working);
        cookie.setVersion(0);
        cookie.setPath("/");
        cookie.setMaxAge(86400*30);
        return cookie;
    }

    public void clearCookies(HttpServletResponse response) {
        Cookie cookie = new Cookie("author_email", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        cookie = new Cookie("author_name", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        cookie = new Cookie("author_design_sig", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        cookie = new Cookie("role", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}