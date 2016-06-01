import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Read the Groovy source and generate matching JavaScript source
 */
public class QABuilder {
    static List<String> buttons = new ArrayList<>();
    static List<String> widgets = new ArrayList<>();
    static List<String> fields = new ArrayList<>();
    public static void main(String[] args) throws Exception {
        File project = new File(System.getProperty("user.dir"));
        File groovy = new File(project, "test/geb/src/test/groovy/CarWarsSupport.groovy");
        BufferedReader in = new BufferedReader(new FileReader(groovy));
        String line, pageName = "";
        boolean started = false, content = false;
        while((line = in.readLine()) != null) {
            line = line.trim();
            if(line.isEmpty() || line.startsWith("//")) continue;
            if(line.startsWith("class ")) {
                String cls = line.substring(6, line.indexOf(' ', 7));
                if(!started) {
                    if(!cls.equals("DefaultPage")) continue;
                    started = true;
                } else {
                    printContents();
                    System.out.println("        },");
                }
                System.out.println("        {");
                System.out.println("            name: '"+cls+"',");
                pageName = cls;
                buttons.clear();
                widgets.clear();
                fields.clear();
            }
            if(!started) continue;
            if(line.contains("static url")) {
                line = line.substring(line.indexOf('=')+1).trim();
                if(line.endsWith(";")) line = line.substring(0, line.length()-1).trim();
                if(line.startsWith("'") || line.startsWith("\"")) line = line.substring(1, line.length()-1);
                System.out.println("            url: '"+line+"'");
            } else if(line.contains("static content")) {
                content = true;
            } else if(line.trim().equals("}")) {
                if(content) content = false;
            } else if(content) {
                if(line.contains(".text()")) continue;
                if(!line.contains(" ")) {
                    System.err.println(line.indexOf(" ") + ": " + line);
                    System.err.flush();
                }
                String name = line.substring(0, line.indexOf(" "));
                if(name.contains("(")) name = name.substring(0, name.indexOf('('));
                if(name.equals("selectEngine") || name.equals("removeTurret") || name.equals("linkButton")
                        || name.equals("linkItem") || name.equals("linkName") || name.equals("caText")
                        || name.equals("switchArmorLocation") || name.equals("switchWeaponsLocation")
                        || name.equals("bottomSwitchOversize")
                        || name.equals("switchTurrets") || name.equals("switchOversizeTurrets")
                        || line.startsWith("weapon() { id") || line.startsWith("weapon(to: WeaponPage) { id")
                        || line.startsWith("weapon(to: HandWeaponPage) { id")
                        || line.startsWith("weaponCategory(to: WeaponListPage) { id")
                        || line.startsWith("weaponCategory(to: HandWeaponListPage) { name")
                        || (pageName.equals("AllWeaponsPage") && line.contains(".has("))
                        || name.contains("inksButton") || name.contains("distribute")
                        || (name.contains("Text") && line.contains(".next()"))
                        ){
                    continue; // Handled elsewhere
                }
                line = line.substring(line.indexOf(' ')+1);
                if(line.contains("span.button-group")) {
                    line = line.substring(line.indexOf("span.button-group.")+18);
                    String group = line.substring(0, line.indexOf(' '));
                    line = line.substring(line.indexOf(' ')+1);
                    if(line.startsWith("button.")) line = line.substring(7);
                    if(line.contains("\"")) line = line.substring(0, line.indexOf('"'));
                    if(line.contains("'")) line = line.substring(0, line.indexOf("'"));
                    buttons.add("{buttonClass: '"+line+"', groupClass: '"+group+"', name: '"+name+"'}");
                } else if(line.contains("id -> $(\"div.") || line.contains("\"div.content a.item\"")) {
                    // e.g. turrets, ammo screen back button
                } else if(line.contains("label.item\").has(\"div") || line.contains("label.item\").has(\"span")
                        || line.contains("a.item")) {
                    line = line.substring(line.indexOf("text: ")+6);
                    line = line.substring(0, line.lastIndexOf(')'));
                    if(line.startsWith("'") || line.startsWith("\"")) line = line.substring(1, line.length()-1);
                    widgets.add("{name: '"+name+"', text: '"+line+"'}");
                } else if(line.contains("$(\"input\",") && line.contains("'ng-model'")) {
                    line = line.substring(line.lastIndexOf(':')+3);
                    line = line.substring(0, line.lastIndexOf(')')-1);
                    fields.add("{name: '"+name+"', attr: 'ng-model', value: '"+line+"'}");
                } else if(line.contains("$(\"input\", placeholder:")) {
                    line = line.substring(line.lastIndexOf(':')+3);
                    line = line.substring(0, line.lastIndexOf(')')-1);
                    fields.add("{name: '"+name+"', attr: 'placeholder', value: '"+line+"'}");
                } else if(line.contains("span.AmmoCount")) {
                    line = line.substring(line.lastIndexOf('.')+1);
                    line = line.substring(0, line.lastIndexOf(')')-1);
                    buttons.add("{buttonClass: '"+line+"', groupClass: 'AmmoCount', name: '"+name+"'}");
                } else if(line.contains("div.bar-header button")) {
                    int pos = line.indexOf("text:");
                    if(pos >= 0) {
                        line = line.substring(pos + 6);
                        line = line.substring(0, line.lastIndexOf(")")).trim();
                        if (line.startsWith("\"") || line.startsWith("'")) line = line.substring(1);
                        if (line.endsWith("\"") || line.endsWith("'")) line = line.substring(0, line.length() - 1);
                    }
                    buttons.add("{buttonClass: 'button', groupClass: 'bar-header', name: '"+name+"'"+(pos > -1 ? ", text: '"+line+"'" : "")+"}");
                } else if(line.contains("button.button")) {
                    line = line.substring(line.indexOf("text: ")+6);
                    line = line.substring(0, line.lastIndexOf(')'));
                    if(line.startsWith("'") || line.startsWith("\"")) line = line.substring(1, line.length()-1);
                    line = line.replace("'", "\\'");
                    String group = pageName.contains("Stock") ? "col" : "toolbar";
                    buttons.add("{buttonClass: 'button', groupClass: '"+group+"', name: '"+name+"', text: '"+line+"'}");
                }
            }
        }
        printContents();
        System.out.println("        }");
    }

    public static void printContents() {
        if(!buttons.isEmpty()) {
            System.out.println("            ,buttons: [");
            for (int i = 0; i < buttons.size(); i++) {
                String button =  buttons.get(i);
                System.out.println("                "+button+(i == buttons.size()-1 ? "" : ","));
            }
            System.out.println("            ]");
        }
        if(!widgets.isEmpty()) {
            System.out.println("            ,widgets: [");
            for (int i = 0; i < widgets.size(); i++) {
                String widget =  widgets.get(i);
                System.out.println("                "+widget+(i == widgets.size()-1 ? "" : ","));
            }
            System.out.println("            ]");
        }
        if(!fields.isEmpty()) {
            System.out.println("            ,fields: [");
            for (int i = 0; i < fields.size(); i++) {
                String field =  fields.get(i);
                System.out.println("                "+field+(i == fields.size()-1 ? "" : ","));
            }
            System.out.println("            ]");
        }
    }
}
