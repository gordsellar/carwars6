package org.opentools.carwars.rest;

import org.opentools.carwars.json.PDFRequest;
import org.opentools.carwars.pdf.PDFGenerator;
import org.springframework.beans.factory.annotation.Autowired;
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
public class PDFController {
    @RequestMapping(value = "/pdf", method = RequestMethod.POST)
    public Map generatePDF(@RequestBody PDFRequest request, HttpServletRequest req) throws IOException {
        PDFGenerator generator = new PDFGenerator();
        File dataDir = new File(System.getenv("OPENSHIFT_DATA_DIR"));
        if(!dataDir.isDirectory() || !dataDir.canRead() || !dataDir.canWrite())
            throw new IllegalArgumentException("Invalid setting for $OPENSHIFT_DATA_DIR: "+dataDir.getAbsolutePath());
        File outputDir = new File(dataDir, "content/pdfs");
        if(!outputDir.isDirectory() || !outputDir.canRead() || !outputDir.canWrite())
            throw new IllegalArgumentException("Invalid setting for PDF output directory: "+outputDir.getAbsolutePath());
        String fileName = generator.generatePDF(request, dataDir, outputDir);
        Map result = new HashMap();
        result.put("url", req.getContextPath()+"/content/pdfs/"+fileName);
        return result;
    }
}