package org.opentools.carwars.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.opentools.carwars.config.AllowedText.cleanse;

/**
 * Just validates and redirects a few aliases
 */
public class Redirector extends HttpServlet {
    private static boolean isNumber(String value) {
        for(int i=0; i<value.length(); i++) {
            if(!Character.isDigit(value.charAt(i))) return false;
        }
        return true;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String value = req.getPathInfo() == null ? null : req.getPathInfo().substring(1);
        if(req.getServletPath().equals("/load")) {
            if(isNumber(value))
                resp.sendRedirect(req.getContextPath()+"/#/load/car/"+value);
            else
                resp.sendError(resp.SC_BAD_REQUEST);
        } else if(req.getServletPath().equals("/lists")) {
            resp.sendRedirect(req.getContextPath()+"/#/load/list/"+cleanse(value, 30));
        } else if(req.getServletPath().equals("/tags")) {
            resp.sendRedirect(req.getContextPath()+"/#/load/tag/"+cleanse(value, 20));
        } else if(req.getServletPath().equals("/name")) {
            resp.sendRedirect(req.getContextPath()+"/#/load/search/"+cleanse(value, 30));
        } else if(req.getServletPath().equals("/stock")) {
            resp.sendRedirect(req.getContextPath()+"/#/load/stock");
        } else if(req.getServletPath().equals("/confirm")) {
            resp.sendRedirect(req.getContextPath()+"/#/load/confirm/"+cleanse(value, 60));
        }
    }
}
