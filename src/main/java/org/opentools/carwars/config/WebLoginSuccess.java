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
        Cookie cookie = new Cookie("author_email", user.getEmail());
        cookie.setPath("/");
        cookie.setMaxAge(86400*30);
        response.addCookie(cookie);
        cookie = new Cookie("author_name", user.getName());
        cookie.setPath("/");
        cookie.setMaxAge(86400*30);
        response.addCookie(cookie);
        cookie = new Cookie("author_design_sig", user.getDesignSignature());
        cookie.setPath("/");
        cookie.setMaxAge(86400*30);
        response.addCookie(cookie);
        cookie = new Cookie("role", user.getRole());
        cookie.setPath("/");
        cookie.setMaxAge(86400*30);
        response.addCookie(cookie);
        response.setStatus(200);
    }
}