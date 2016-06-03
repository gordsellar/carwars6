package org.opentools.carwars.rest;

import org.opentools.carwars.json.PDFRequest;
import org.opentools.carwars.pdf.PDFGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Functions that deal with PDFs
 */
@RestController
public class PDFController extends BaseController {
    @RequestMapping(value = "/pdf", method = RequestMethod.POST)
    public Map generatePDF(@RequestBody PDFRequest request, HttpServletRequest req) throws IOException {
        String fileName = writePDF(request, true).fileName;
        Map result = new HashMap();
        result.put("url", req.getContextPath()+"/content/pdfs/"+fileName);
        return result;
    }
}
