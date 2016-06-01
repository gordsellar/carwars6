package org.opentools.carwars.config;

import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Parameters for passwords saved in the system
 */
public class PasswordConfig {
    private String prefix;
    private ShaPasswordEncoder sha = new ShaPasswordEncoder(256);
    private BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder(12);
    private PasswordEncoder passwordEncoder;

    public PasswordConfig() {
        sha.setEncodeHashAsBase64(true);
        passwordEncoder = new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return bcrypt.encode(charSequence);
            }

            @Override
            public boolean matches(CharSequence enteredPassword, String storedHash) {
                if(storedHash.startsWith("$2a$")) return bcrypt.matches(enteredPassword, storedHash);
                return sha.encodePassword(prefix+enteredPassword, null).equals(storedHash);
            }
        };
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public synchronized String createNewPassword(String source) {
        return bcrypt.encode(source);
    }

    public synchronized String createConfirmationKey() {
        String prefix = System.getenv("CARWARS_CONFIRMATION_PREFIX");
        String key = sha.encodePassword(prefix+Math.random(), null);
        return key.replace("/", "_").replace("+", "-").replace("=", ".");
    }

    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }
}
