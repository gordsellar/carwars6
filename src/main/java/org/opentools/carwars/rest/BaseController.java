package org.opentools.carwars.rest;

import org.opentools.carwars.config.PasswordConfig;
import org.opentools.carwars.data.UserRepository;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.opentools.carwars.json.PDFRequest;
import org.opentools.carwars.pdf.PDFGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.internet.MimeUtility;
import java.io.*;

/**
 * Some common functions
 */
public class BaseController {
    @Autowired
    protected PasswordConfig passwords;
    @Autowired
    protected UserRepository users;
    @Autowired
    protected JavaMailSender mailSender;

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

    protected void saveImageFile(long id, String image) {
        if(image != null && image.startsWith("data:image/png;base64,")) {
            try {
                File outFile = new File(System.getenv("OPENSHIFT_DATA_DIR"), "content/designs/"+id+".png");
                InputStream in = MimeUtility.decode(new ByteArrayInputStream(image.substring(22).getBytes("US-ASCII")), "base64");
                FileOutputStream fout = new FileOutputStream(outFile);
                byte[] buf = new byte[2048];
                int len;
                while((len = in.read(buf)) > 0) {
                    fout.write(buf, 0, len);
                }
                fout.flush();
                fout.close();
                in.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    protected PDFGenerator.GenerateResult writePDF(PDFRequest request, boolean temporary) throws IOException {
        PDFGenerator generator = new PDFGenerator();
        File dataDir = new File(System.getenv("OPENSHIFT_DATA_DIR"));
        if(!dataDir.isDirectory() || !dataDir.canRead() || !dataDir.canWrite())
            throw new IllegalArgumentException("Invalid setting for $OPENSHIFT_DATA_DIR: "+dataDir.getAbsolutePath());
        File outputDir = new File(dataDir, temporary ? "content/pdfs" : "content/designs");
        if(!outputDir.isDirectory() || !outputDir.canRead() || !outputDir.canWrite())
            throw new IllegalArgumentException("Invalid setting for PDF output directory: "+outputDir.getAbsolutePath());
        return generator.generatePDF(request, dataDir, outputDir, mailSender);
    }
}
