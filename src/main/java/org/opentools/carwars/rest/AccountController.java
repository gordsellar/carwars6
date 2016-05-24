package org.opentools.carwars.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Controller for calls related to an account
 * except for login/logout which are handled by the security system
 */
@Controller
public class AccountController {
    @RequestMapping("/secure/cookies")
    public void setCookies(HttpServletResponse response) {
        Cookie cookie = new Cookie("author_email", "test_email");
        cookie.setPath("/");
        cookie.setMaxAge(60*60*24*30);
        response.addCookie(cookie);
        cookie = new Cookie("author_name", "test_name");
        cookie.setPath("/");
        cookie.setMaxAge(60*60*24*30);
        response.addCookie(cookie);
        cookie = new Cookie("role", "Admin");
        cookie.setPath("/");
        cookie.setMaxAge(60*60*24*30);
        response.addCookie(cookie);
    }
}
