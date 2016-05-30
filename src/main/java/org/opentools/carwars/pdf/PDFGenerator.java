package org.opentools.carwars.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.opentools.carwars.json.PDFRequest;

import java.awt.Color;
import java.io.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.GZIPOutputStream;

/**
 * Generates a design PDF from all the provided input
 */
public class PDFGenerator {
    private final static float KAPPA = (float) (4.0 * ((Math.sqrt(2) - 1.0) / 3.0));
    private final static float LEADING = 1.15f;
    private PDDocument doc;
    private PDPage page;
    private PDFRequest request;
    private PDFont stop;
    private PDPageContentStream pdf;
    private PDFont font;
    private float fontSize;

    public String generatePDF(PDFRequest request, File fontDir, File saveDir) throws IOException {
        this.request = request;
        try {
            startDocument();
            loadFonts(fontDir);
            drawBackground();
            drawBasicInformation();

            return saveDocument(saveDir);
        } finally {
            doc.close();
        }
    }

    private void startDocument() {
        doc = new PDDocument();
        page = new PDPage();
        doc.addPage(page);
    }

    private void loadFonts(File fontDir) throws IOException {
        stop = PDType0Font.load(doc, new File(fontDir, "stop2.ttf"));
    }

    private void drawBackground() throws IOException {
        newStream();
        pdf.setStrokingColor(Color.BLACK);
        pdf.addRect(36, 36, 36, 36);
        pdf.addRect(36, 82, 36, 36);
        pdf.addRect(36, 128, 36, 36);
        pdf.addRect(36, 174, 36, 36);
        pdf.addRect(36, 220, 36, 36);
        pdf.addRect(36, 266, 36, 36);
        pdf.addRect(36, 312, 36, 36);
        pdf.addRect(36, 358, 36, 36);
        pdf.addRect(36, 404, 36, 36);
        pdf.addRect(36, 450, 36, 36);
        pdf.addRect(36, 496, 36, 36);
        pdf.addRect(36, 542, 36, 36);
        pdf.addRect(36, 588, 36, 26);
        pdf.addRect(36, 624, 36, 16);
        pdf.addRect(36, 650, 36, 6);
        pdf.moveTo(36, 666);
        pdf.lineTo(36, 720);
        drawTopLeft(54, 720, 18, true);
        pdf.lineTo(504, 738);
        pdf.lineTo(504, 756);
        pdf.lineTo(576, 720);
        pdf.lineTo(504, 684);
        pdf.lineTo(504, 702);
        pdf.lineTo(90, 702);
        drawTopLeft(90, 684, 18, false);
        pdf.lineTo(72, 666);
        pdf.closeAndStroke();

        newStream();

        pdf.setStrokingColor(Color.BLACK);
        pdf.setNonStrokingColor(new Color(0xAAAAAA));
        pdf.beginText();
        setFont(stop, 36);
        pdf.newLineAtOffset(92, 709);
        pdf.showText("CAR WARS COMBAT GARAGE");
        pdf.endText();

        closeStream();
    }

    private void drawBasicInformation() throws IOException {
        newStream();

        // Car Name
        int adjust = Integer.parseInt(request.statistics.cost.replace(",", "")) > 99999 ? 10 : 0;
        pdf.setStrokingColor(Color.BLACK);
        pdf.setNonStrokingColor(Color.BLACK);
        setFont(PDType1Font.HELVETICA, 24);
        fitText(90, 658, 245-adjust, 30, request.statistics.name, false);
        // Cost
        drawRoundedRectangle(340-adjust, 691-24, 79+adjust, 24, 3);
        drawRoundedRectangle(342-adjust, 689-20, 75+adjust, 20, 3);
        pdf.closeAndStroke();
        pdf.beginText();
        setFont(font, 18);
        pdf.newLineAtOffset(346-adjust, 673);
        pdf.showText("$"+request.statistics.cost);
        pdf.endText();

        // Kills & Wins
        setFont(font, 10);
        textAlignRight(430, 689-20, 32, 20, "KILLS:\nWINS:");

        // Statistics Box 1: VEHICLE
        drawRoundedRectangle(90, 550, 150, 100, 3);
        pdf.stroke();
        setFont(font, 14);
        textAlignCenter(90, 628, 150, 20, "VEHICLE");
        pdf.moveTo(105, 645);
        pdf.lineTo(130, 645);
        pdf.moveTo(95, 642);
        pdf.lineTo(130, 642);
        pdf.moveTo(105, 639);
        pdf.lineTo(130, 639);
        pdf.moveTo(225, 645);
        pdf.lineTo(200, 645);
        pdf.moveTo(235, 642);
        pdf.lineTo(200, 642);
        pdf.moveTo(225, 639);
        pdf.lineTo(200, 639);
        pdf.stroke();
        setFont(font, 10);
        textAlignRight(92, 550, 60, 80, "Body:\nChassis:\nSuspension:\nWeight:\nTech Level:\nHand Wpns:");
        String text = request.statistics.body+"\n"+
                request.statistics.chassis+"\n"+
                request.statistics.suspension+"\n"+
                request.statistics.weight+" lbs.\n"+
                (request.statistics.techLevel.equals("CWC") ? "CWC 2.5" : request.statistics.techLevel.equals("All") ? "UACFH/Pyramid" : request.statistics.techLevel)+"\n";
        boolean weapons = false;
        for (PDFRequest.Line line : request.worksheet) {
            if(line.ge != null) {
                weapons = true;
                break;
            }
        }
        text += weapons ? request.statistics.useGE ? "GEs" : "Alt. Encumbrance" : "N/A";
        textAlignLeft(157, 540, 60, 90, text);

        // Statistics Box 2: PERFORMANCE
        drawRoundedRectangle(250, 550, 150, 100, 3);
        pdf.stroke();
        setFont(font, 14);
        textAlignCenter(250, 628, 150, 20, "PERFORMANCE");
        pdf.moveTo(260, 645);
        pdf.lineTo(267, 645);
        pdf.moveTo(255, 642);
        pdf.lineTo(267, 642);
        pdf.moveTo(260, 639);
        pdf.lineTo(267, 639);
        pdf.moveTo(390, 645);
        pdf.lineTo(383, 645);
        pdf.moveTo(395, 642);
        pdf.lineTo(383, 642);
        pdf.moveTo(390, 639);
        pdf.lineTo(383, 639);
        pdf.stroke();
        setFont(font, 10);
        text = "Handling Class:\nAcceleration:\nTopSpeed:";
        if(request.statistics.range != null &&
                (request.statistics.cargoWeight == null || request.statistics.sidecarCargoSpace == null || request.statistics.sidecarCargoWeight == null))
            text += "\nRange:";
        text += "\nCargo Space:";
        if(request.statistics.cargoWeight != null) text += "\nCargo Weight:";
        if(request.statistics.sidecarCargoSpace != null) text += "\nSC Crg Space:";
        if(request.statistics.sidecarCargoWeight != null) text += "\nSC Crg Weight:";
        textAlignRight(252, 535, 75, 95, text);
        text = request.statistics.handlingClass+"\n"+request.statistics.acceleration+"\n"+request.statistics.topSpeed;
        if(request.statistics.range != null &&
                (request.statistics.cargoWeight == null || request.statistics.sidecarCargoSpace == null || request.statistics.sidecarCargoWeight == null))
            text += "\n"+request.statistics.range;
        if(request.statistics.cargoSpace.compareTo(BigDecimal.ZERO) == 0) text += "\nnone";
        else text += "\n"+request.statistics.cargoSpace+" space"+(request.statistics.cargoSpace.compareTo(BigDecimal.ONE) == 0 ? "" : "s");
        if(request.statistics.cargoWeight != null) text += "\n"+request.statistics.cargoWeight+" lbs.";
        if(request.statistics.sidecarCargoSpace != null) text += "\n"+request.statistics.sidecarCargoSpace+" space"+(request.statistics.sidecarCargoSpace.compareTo(BigDecimal.ONE) == 0 ? "" : "s");
        if(request.statistics.sidecarCargoWeight != null) text += "\n"+request.statistics.sidecarCargoWeight+" lbs.";
        textAlignLeft(332, 535, 68, 95, text);

        // Statistics Box 3: CREW
        drawRoundedRectangle(410, 550, 150, 100, 3);
        pdf.stroke();
        setFont(font, 14);
        textAlignCenter(410, 628, 150, 20, "CREW");
        pdf.moveTo(425, 645);
        pdf.lineTo(459, 645);
        pdf.moveTo(415, 642);
        pdf.lineTo(459, 642);
        pdf.moveTo(425, 639);
        pdf.lineTo(459, 639);
        pdf.moveTo(545, 645);
        pdf.lineTo(511, 645);
        pdf.moveTo(555, 642);
        pdf.lineTo(511, 642);
        pdf.moveTo(545, 639);
        pdf.lineTo(511, 639);
        pdf.stroke();
        setFont(font, 10);
        String ltext = "";
        text = "";
        for (String person : request.statistics.crew) {
            if(ltext.length() > 0) {
                ltext += "\n";
                text += "\n";
            }
            ltext += person;
            if(person.equals("Driver") || person.equals("Cyclist")) {
                text += "\nReflex Roll:";
                ltext += "\n";
            }
            text += "\nDriver Skill:";
            ltext += "\n";
            text += "\nGunner Skill:";
            ltext += "\n";
        }
        textAlignLeft(415, 550, 70, 80, ltext);
        textAlignRight(415, 550, 70, 80, text);

        // Weapons box
        int armorWidth = 65, armorHeight = 92;
        if(request.armor.size() > 9) {
            armorWidth = request.armor.get(0).value.contains("/") ? 90 : 85;
            armorHeight = 12*request.armor.size();
        }
        if(request.weapons.size()*11+15 > armorHeight) armorHeight = request.weapons.size()*11+15;
        drawRoundedRectangle(90, 520-armorHeight, 310, armorHeight+20, 3);
        pdf.stroke();
        setFont(font, 14);
        textAlignCenter(90, 518, 310, 20, "WEAPONS");
        pdf.moveTo(105, 535);
        pdf.lineTo(204, 535);
        pdf.moveTo(95, 532);
        pdf.lineTo(204, 532);
        pdf.moveTo(105, 529);
        pdf.lineTo(204, 529);
        pdf.moveTo(385, 535);
        pdf.lineTo(286, 535);
        pdf.moveTo(395, 532);
        pdf.lineTo(286, 532);
        pdf.moveTo(385, 529);
        pdf.lineTo(286, 529);
        pdf.stroke();
        setFont(font, 8);
        // TODO: Weapons table

        // Armor Box
        drawRoundedRectangle(410, 520-armorHeight, 150, armorHeight+20, 3);
        pdf.stroke();
        setFont(font, 14);
        textAlignCenter(410, 518, 150, 20, "ARMOR");
        pdf.moveTo(425, 535);
        pdf.lineTo(454, 535);
        pdf.moveTo(415, 532);
        pdf.lineTo(454, 532);
        pdf.moveTo(425, 529);
        pdf.lineTo(454, 529);
        pdf.moveTo(545, 535);
        pdf.lineTo(516, 535);
        pdf.moveTo(555, 532);
        pdf.lineTo(516, 532);
        pdf.moveTo(545, 529);
        pdf.lineTo(516, 529);
        pdf.stroke();
        setFont(font, 10);
        text = "";
        for (PDFRequest.Armor armor : request.armor) {
            if(text.length() > 0) text += "\n";
            text += armor.location+" "+armor.value+":";
        }
        textAlignRight(415, 520-armorHeight, armorWidth, armorHeight, text, request.armor.size() > 6 ? 0 : 4);

        setFont(font, 10);
        fitText(90, 420-armorHeight, 310, 92, request.summary, true);
        fitText(410, 420-armorHeight, 150, 92, "Walkaround: "+request.walkaround, true);// TODO: bold "Walkaround:"

        closeStream();
    }


    private String saveDocument(File dir) throws IOException {
//        int number = (int)(Math.random()*Integer.MAX_VALUE);
        int number = 0;
        String fileName = "car-design-" + request.statistics.name.replaceAll("[^A-Za-z0-9]", "_") + "-" + number + ".pdf";
        OutputStream out = new GZIPOutputStream(new BufferedOutputStream(new FileOutputStream(new File(dir, fileName + ".gz"))));
        doc.save(out);
        out.flush();
        out.close();
        return fileName;
    }

    private void textAlignLeft(float x, float y, float w, float h, String text) throws IOException {
        float top;
        String[] lines = text.split("\\n");

        top = y+h-1;
        pdf.saveGraphicsState();
        pdf.addRect(x, y, w, h);
        pdf.clip();
        pdf.beginText();
        for (String line : lines) {
            if(!line.equals("")) {
                pdf.saveGraphicsState();
                pdf.newLineAtOffset(x, top-font.getFontDescriptor().getAscent()*fontSize/1000f);
                pdf.showText(line);
                pdf.restoreGraphicsState();
            }
            top -= fontSize*LEADING;
        }
        pdf.endText();
        pdf.restoreGraphicsState();
    }

    private void textAlignRight(float x, float y, float w, float h, String text) throws IOException {
        textAlignRight(x, y, w, h, text, 0);
    }
    private void textAlignRight(float x, float y, float w, float h, String text, float extraSpace) throws IOException {
        float tw, top;
        String[] lines = text.split("\\n");

        top = y+h-1;
        pdf.saveGraphicsState();
        pdf.addRect(x, y, w, h);
        pdf.clip();
        pdf.beginText();
        for (String line : lines) {
            if(!line.equals("")) {
                tw = font.getStringWidth(line)*fontSize/1000f;
                pdf.saveGraphicsState();
                pdf.newLineAtOffset(x+w-tw, top-font.getFontDescriptor().getAscent()*fontSize/1000f);
                pdf.showText(line);
                pdf.restoreGraphicsState();
            }
            top -= fontSize*LEADING+extraSpace;
        }
        pdf.endText();
        pdf.restoreGraphicsState();
    }

    private void textAlignCenter(float x, float y, float w, float h, String text) throws IOException {
        float tw, top;
        String[] lines = text.split("\\n");

        top = y+h-1;
        pdf.saveGraphicsState();
        pdf.addRect(x, y, w, h);
        pdf.clip();
        pdf.beginText();
        for (String line : lines) {
            if(!line.equals("")) {
                tw = (w-font.getStringWidth(line)*fontSize/1000f)/2f;
                pdf.saveGraphicsState();
                pdf.newLineAtOffset(x+tw, top-font.getFontDescriptor().getAscent()*fontSize/1000f);
                pdf.showText(line);
                pdf.restoreGraphicsState();
            }
            top -= fontSize*LEADING;
        }
        pdf.endText();
        pdf.restoreGraphicsState();
    }

    private void fitText(float x, float y, float w, float h, String text, boolean wrap) throws IOException {
        float size = fontSize;
        if(wrap) {
            int i;
            String[] paras = text.split("\\n");
            List<String> words = new ArrayList<>();
            for(i=0; i<paras.length; i++) {
                if(words.size() > 0) words.add("\n");
                words.addAll(Arrays.asList(paras[i].split("\\s+")));
            }
            String line, test;
            List<String> lines = new ArrayList<>();
            float yTot;
            while(true) {
                yTot = size*LEADING;
                lines.clear();
                line = "";
                for(i=0; i<words.size(); i++) {
                    test = line.length() > 0 ? line + " " + words.get(i) : words.get(i);
                    if(words.get(i).equals("\n") || font.getStringWidth(test)*size/1000f > w) {
                        lines.add(line);
                        line = "";
                        yTot += size * LEADING;
                        if(yTot > h) break;
                        if(!words.get(i).equals("\n")) i -= 1;
                    } else line = test;
                }
                if(line.length() > 0) lines.add(line);
                if(yTot < h || size <= 2) break;
                size -= 1;
            }
            float oldSize = fontSize;
            setFont(font, size);
            test = "";
            for(i=0; i<lines.size(); i++) {
                if(i > 0) test += "\n";
                test += lines.get(i);
            }
            textAlignLeft(x, y, w, h, test);
            setFont(font, oldSize);
        } else {
            while (font.getStringWidth(text)*size/1000f > w || fontSize > h) size -= 1;
//            pdf.saveGraphicsState();
//            pdf.setStrokingColor(Color.BLACK);
//            pdf.addRect(x, y, w, h);
//            pdf.closeAndStroke();
//            pdf.restoreGraphicsState();

            pdf.saveGraphicsState();
            pdf.addRect(x, y, w, h);
            pdf.clip();
            pdf.beginText();
            pdf.setFont(font, size);
            pdf.newLineAtOffset(x, y+h-font.getFontDescriptor().getAscent()*size/1000f);
            pdf.showText(text);
            pdf.endText();
            pdf.restoreGraphicsState();
        }
    }

    private void newStream() throws IOException {
        if(pdf != null) closeStream();
        pdf = new PDPageContentStream(doc, page, PDPageContentStream.AppendMode.APPEND, false);
    }

    private void closeStream() throws IOException {
        pdf.close();
        pdf = null;
        font = null;
        fontSize = 0;
    }

    private void setFont(PDFont font, float size) throws IOException {
        fontSize = size;
        this.font = font;
        pdf.setFont(font, fontSize);
        pdf.setLeading(fontSize * 1.2);
    }

    private void drawRoundedRectangle(float x, float y, float w, float h, float radius) throws IOException {
        pdf.moveTo(x+radius, y);
        pdf.lineTo(x+w-radius, y);
        drawBottomRight(x+w-radius, y+radius, radius, false);
        pdf.lineTo(x+w, y+h-radius);
        drawTopRight(x+w-radius, y+h-radius, radius, false);
        pdf.lineTo(x+radius, y+h);
        drawTopLeft(x+radius, y+h-radius, radius, false);
        pdf.lineTo(x, y+radius);
        drawBottomLeft(x+radius, y+radius, radius, false);
        pdf.closePath();
    }

    private void drawTopLeft(float x, float y, float r, boolean clockwise) throws IOException {
        float cpl = r * KAPPA;
        if (clockwise)
            pdf.curveTo(x - r, y + cpl, x - cpl, y + r, x, y + r);
        else
            pdf.curveTo(x - cpl, y + r, x - r, y + cpl, x - r, y);
    }

    private void drawTopRight(float x, float y, float r, boolean clockwise) throws IOException {
        float cpl = r * KAPPA;
        if (clockwise)
            pdf.curveTo(x + cpl, y + r, x + r, y + cpl, x + r, y);
        else
            pdf.curveTo(x + r, y + cpl, x + cpl, y + r, x, y + r);
    }

    private void drawBottomRight(float x, float y, float r, boolean clockwise) throws IOException {
        float cpl = r * KAPPA;
        if (clockwise)
            pdf.curveTo(x + r, y - cpl, x + cpl, y - r, x, y - r);
        else
            pdf.curveTo(x + cpl, y - r, x + r, y - cpl, x + r, y);
    }

    private void drawBottomLeft(float x, float y, float r, boolean clockwise) throws IOException {
        float cpl = r * KAPPA;
        if (clockwise)
            pdf.curveTo(x - cpl, y - r, x - r, y - cpl, x - r, y);
        else
            pdf.curveTo(x - r, y - cpl, x - cpl, y - r, x, y - r);
    }
}
