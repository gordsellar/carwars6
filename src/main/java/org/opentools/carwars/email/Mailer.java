package org.opentools.carwars.email;

import com.sun.mail.util.MailConnectException;
import org.opentools.carwars.data.DesignHistory;
import org.opentools.carwars.entity.DBCarDesign;
import org.opentools.carwars.entity.DBCarWarsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.net.ConnectException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Centralize logic for e-mails
 */
@Component
public class Mailer {
    private final static String FROM = "Car Wars Combat Garage <combat-garage@opentools.org>";

    @Autowired
    private JavaMailSender mailSender;

    public void sendAccountEmail(final String email, final String name, final String key) {
        StringBuilder buf = new StringBuilder();
        buf.append("<p>Someone has requested a new Car Wars Combat Garage account for ").append(email).append(".\n").append(
                "If you would like to confirm this and create an account, please\n").append(
                "<a href='http://carwars.opentools.org/confirm/").append(key).append(
                "'>click here</a>.</p>");
        buf.append("<p>Creating an account will let you access your previous car designs through the Web interface\n").append(
                "rather than just clicking the links I e-mail to you.  You will also be able to review stock\n").append(
                "car designs.</p>\n\n").append(
                "<p>In any case, happy duelling!</p>");

        final String text = buf.toString();
        MimeMessagePreparator mmp = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
                String to = name == null || name.equals("") ? email : name+" <"+email+">";
                message.setTo(to);
                message.setFrom(FROM);
                message.setSubject("Car Wars Combat Garage Account");
                message.setText(text, true);
            }
        };
        try {
            this.mailSender.send(mmp);
        } catch (MailException e) {
            if(e.getCause() instanceof MailConnectException && e.getCause().getCause() instanceof ConnectException &&
                    e.getCause().getMessage().contains("localhost")) {
                System.err.println(text);
            } else {
                e.printStackTrace();
            }
        }
    }

    public void sendResetEmail(final String email, final String name, final String key) {
        StringBuilder buf = new StringBuilder();
        buf.append("<p>The Car Wars Combat Garage password for ").append(email).append(" was reset\n").append(
                "on ").append(new SimpleDateFormat("MM/dd/yyyy hh:mm aa").format(new Date())).append(
                ".  To choose a new password, please\n").append("<a href='http://carwars.opentools.org/confirm/").append(
                key).append("'>click here</a>.</p>\n\n");
        buf.append("<p>Happy duelling!</p>");

        final String text = buf.toString();
        MimeMessagePreparator mmp = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
                String to = name == null || name.equals("") ? email : name+" <"+email+">";
                message.setTo(to);
                message.setFrom(FROM);
                message.setSubject("Car Wars Combat Garage Password Reset");
                message.setText(text, true);
            }
        };
        try {
            this.mailSender.send(mmp);
        } catch (MailException e) {
            if(e.getCause() instanceof MailConnectException && e.getCause().getCause() instanceof ConnectException &&
                    e.getCause().getMessage().contains("localhost")) {
                System.err.println(text);
            } else {
                e.printStackTrace();
            }
        }
    }

    public void sendDesignEmail(final DBCarWarsUser user, List<DBCarDesign> designs) {
        StringBuilder buf = new StringBuilder();
        buf.append("<h2>Car Designs</h2>\n").append(
                "<p>These are the car designs on record for "+user.getEmail()+":</p>\n").append(
                "<table border='1'>\n").append(
                "  <tr>\n").append(
                "    <th>Name</th>\n").append(
                "    <th>Body</th>\n").append(
                "    <th>Cost</th>\n").append(
                "    <th>Date</th>\n").append(
                "  </tr>\n");
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy hh:mm aa");
        for (DesignHistory design : designs) {
            buf.append("  <tr><td><a href='http://carwars.opentools.org/load/").append(design.getUiId()).append("'>").append(
                    design.getDesignName()).append("</a></td>").append(
                    "<td>").append(design.getBody()).append("</td><td>$").append(design.getCost()).append("</td><td>").append(
                    sdf.format(design.getCreateDate())).append("</td></tr>\n");
        }
        buf.append("</table>\n");
        if(!user.isConfirmed()) {
            buf.append("\n<p>If you'd like to create an account to load your designs through the UI, <a href='http://carwars.opentools.org/confirm/").append(
                    user.getConfirmationKey()).append("'>click here</a>.</p>");
        }
        buf.append("<p>Happy duelling!</p>\n");

        final String text = buf.toString();
        MimeMessagePreparator mmp = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
                String to = user.getName() == null || user.getName().equals("") ? user.getEmail() : user.getName()+" <"+user.getEmail()+">";
                message.setTo(to);
                message.setFrom(FROM);
                message.setSubject("Your Car Design");
                message.setText(text, true);
            }
        };
        try {
            this.mailSender.send(mmp);
        } catch (MailException e) {
            if(e.getCause() instanceof MailConnectException && e.getCause().getCause() instanceof ConnectException &&
                    e.getCause().getMessage().contains("localhost")) {
                System.err.println(text);
            } else {
                e.printStackTrace();
            }
        }
    }

    public void sendMismatchEmail(String summary, String generatedName) {
        final String text = "<p>I noticed a problem with the following design:</p>"+
                "<p>"+summary+"\n"+
                "<p>You can view the PDF here: <a href='http://carwars.opentools.org/content/pdfs/"+generatedName+"'>"+generatedName+"</a></p>";
        MimeMessagePreparator mmp = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws Exception {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage);
                message.setTo("Aaron Mulder <ammulder@alumni.princeton.edu>");
                message.setFrom(FROM);
                message.setSubject("Combat Garage Worksheet Discrepancy");
                message.setText(text, true);
            }
        };
        try {
            this.mailSender.send(mmp);
        } catch (MailException e) {
            if(e.getCause() instanceof MailConnectException && e.getCause().getCause() instanceof ConnectException &&
                    e.getCause().getMessage().contains("localhost")) {
                System.err.println(text);
            } else {
                e.printStackTrace();
            }
        }
    }
}
