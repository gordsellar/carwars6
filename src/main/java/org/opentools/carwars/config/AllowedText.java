package org.opentools.carwars.config;

/**
 * Strip HTML
 */
public class AllowedText {
    public static String cleanse(String source, int maxLength) {
        String result = source.replaceAll("&(\\S+;)", "&amp;$1").replace("<", "&lt;").replace(">", "&gt;");
        // Could also replace single/double quotes, but those may be legit in a name...
        return result.length() > maxLength ? result.substring(0, maxLength) : result;
    }
}
