package org.opentools.carwars.pdf;

import be.quodlibet.boxable.BaseTable;
import be.quodlibet.boxable.Cell;
import be.quodlibet.boxable.HorizontalAlignment;
import be.quodlibet.boxable.Row;
import be.quodlibet.boxable.datatable.DataTable;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
import org.apache.pdfbox.util.Matrix;
import org.opentools.carwars.json.PDFRequest;

import java.awt.Color;
import java.io.*;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    private int version;

    public String generatePDF(PDFRequest request, File fontDir, File saveDir) throws IOException {
        this.request = request;
        try {
            startDocument();
            loadFonts(fontDir);
            drawBackground();
            float armorHeight = drawBasicInformation();
            drawDescriptions(armorHeight);
            drawDiagram(armorHeight);
            drawURL();
            drawDesignWorksheet();
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

    private float drawBasicInformation() throws IOException {
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

        pdf.saveGraphicsState();
        pdf.addRect(91, 519-armorHeight, 308, armorHeight+2);
        pdf.clip();
        closeStream();

        BaseTable base = new BaseTable(520, 0, 0, 300, 95, doc, page, false, true);
        DataTable data = new DataTable(base, page);
        List<List> rows = new ArrayList<>();
        rows.add(Arrays.asList("Weapon Name","Ammo Type","To Hit", "Damage", "FM", "BD"));
        for (PDFRequest.Weapon weapon : request.weapons) {
            List<String> row = new ArrayList<>();
            row.add(weapon.weapon.equals("Vulcan Machine Gun") ? "Vulcan MG" : weapon.weapon);
            row.add(weapon.ammo.equals("High-Temperature") ? "High Temp." : weapon.ammo);
            row.add(weapon.toHit.equals("0") ? "" : weapon.toHit);
            row.add(weapon.damage.equals("0") ? "" : weapon.damage);
            row.add(weapon.fireModifier != null && weapon.fireModifier > 0 ? weapon.fireModifier.toString() : "");
            row.add(weapon.fireModifier != null && weapon.fireModifier > 0 ? weapon.burnDuration.toString() : "");
            rows.add(row);
        }
        data.addListToTable(rows, true);
        for (Row<PDPage> row : base.getRows()) {
            for (int i = 0; i < row.getCells().size(); i++) {
                Cell<PDPage> cell = row.getCells().get(i);
                cell.setFontSize(8);
                cell.setFillColor(null);
                cell.setTopPadding(request.weapons.size() > 7 ? 1 : 3);
                cell.setBottomPadding(request.weapons.size() > 7 ? 1 : 3);
                cell.setLeftPadding(1);
                cell.setRightPadding(1);
                cell.setHeight(null);
                if(i > 1) cell.setAlign(HorizontalAlignment.CENTER);
            }
            row.setHeight(0);
        }
        base.draw();

        newStream();
        pdf.restoreGraphicsState();
        closeStream();

        return armorHeight;
    }

    private void drawDescriptions(float armorHeight) throws IOException {
        newStream();

        setFont(PDType1Font.HELVETICA, 10);
        fitText(90, 420-armorHeight, 310, 92, request.summary, true);
        fitText(410, 420-armorHeight, 150, 92, "Walkaround: "+request.walkaround, true);// TODO: bold "Walkaround:"

        if(!request.legal) {
            pdf.setFont(font, 48);
            pdf.saveGraphicsState();
            pdf.transform(Matrix.getRotateInstance(0.25, 90+310/2, 420+46-armorHeight));
            PDExtendedGraphicsState state = new PDExtendedGraphicsState();
            state.setNonStrokingAlphaConstant(0.3f);
            pdf.setGraphicsStateParameters(state);
            pdf.beginText();
            String message = "Illegal Design";
            pdf.newLineAtOffset(-font.getStringWidth(message)*48f/2000f, -font.getFontDescriptor().getAscent()*48f/2000f);
            pdf.showText(message);
            pdf.endText();
            pdf.restoreGraphicsState();
        }

        closeStream();
    }

    private void drawURL() throws IOException {
        newStream();
        setFont(PDType1Font.HELVETICA_OBLIQUE, 8);
        String message = "http://carwars.opentools.org/ (version "+version+").  PDF'd at "+
                new SimpleDateFormat("MM/dd/yyyy hh:mm aa").format(new Date())+".";
        if(request.statistics.stock_id != null) message += "  Stock ID "+request.statistics.stock_id;
        if(request.statistics.save_id != null) message += "  Design ID "+request.statistics.save_id;
        pdf.setStrokingColor(Color.BLACK);
        pdf.saveGraphicsState();
        pdf.transform(Matrix.getRotateInstance(Math.PI/2, 72, 36));
        pdf.beginText();
        pdf.newLineAtOffset(0, -2-font.getFontDescriptor().getAscent()*8f/1000f);
        pdf.showText(message);
        pdf.endText();
        pdf.restoreGraphicsState();
        closeStream();
    }

    private void drawDesignWorksheet() throws IOException {
        page = new PDPage();
        doc.addPage(page);
        newStream();
        setFont(PDType1Font.HELVETICA, 20);
        pdf.setNonStrokingColor(Color.BLACK);
        textAlignCenter(36, 72*10.5f-20, 7.5f*72, 20, "Design Worksheet");
        closeStream();
        BaseTable base = new BaseTable(72*10.5f-24, 72*10.5f, 36, 7.5f*72, 36, doc, page, true, true);
        DataTable data = new DataTable(base, page);
        List<List> rows = new ArrayList<>();
        rows.add(Arrays.asList("Description","Cost","Total","Weight","Total","Space","Total"));
        BigDecimal totalCost = BigDecimal.ZERO, totalWeight = BigDecimal.ZERO, totalSpace = BigDecimal.ZERO,
                otherCost = BigDecimal.ZERO, otherWeight=BigDecimal.ZERO;
        boolean useGE = request.statistics.useGE;
        for (PDFRequest.Line line : request.worksheet) {
            if(line.name.equals("")) {
                otherCost = totalCost;
                otherWeight = totalWeight;
                totalCost = BigDecimal.ZERO;
                totalWeight = BigDecimal.ZERO;
                totalSpace = BigDecimal.ZERO;
                rows.add(Arrays.asList("","","","","","",""));
            } else {
                totalCost = totalCost.add(line.cost);
                if((!useGE || line.ge == null) && line.ignoreWeight == null)
                    totalWeight = totalWeight.add(line.weight);
                if(line.vehicularSpace)
                    totalSpace = totalSpace.add(line.space);
                List<String> row = new ArrayList<>();
                row.add(line.name);
                row.add("$"+line.cost);
                row.add("$"+totalCost);
                row.add(useGE && line.ge != null ? line.ge+" GE"+(line.vehicularSpace ? "" : "*") : line.weight+(line.ignoreWeight != null && line.ignoreWeight && line.weight.signum() > 0 ? "*" : "")+" lbs");
                row.add(totalWeight+" lbs");
                row.add(line.space+(line.vehicularSpace || line.space.signum() == 0 ? "" : "*")+(line.cargo ? "c" : ""));
                row.add(totalSpace.toString());
                rows.add(row);
            }
        }
        data.addListToTable(rows, true);
        for (Row<PDPage> row : base.getRows()) {
            for (int i = 0; i < row.getCells().size(); i++) {
                Cell<PDPage> cell = row.getCells().get(i);
                cell.setFontSize(10);
                cell.setLeftPadding(3);
                cell.setRightPadding(3);
                cell.setTopPadding(2);
                cell.setBottomPadding(2);
                if(i>4) cell.setAlign(HorizontalAlignment.CENTER);
            }
        }
        base.draw();
        if(totalCost.add(otherCost).compareTo(new BigDecimal(request.statistics.cost.replace(",", ""))) != 0 ||
                totalWeight.add(otherWeight).compareTo(new BigDecimal(request.statistics.weight)) != 0) {
            System.err.println("ERROR "+totalCost.add(otherCost)+" <> "+request.statistics.cost+" OR "+totalWeight.add(otherWeight)+" <> "+request.statistics.weight);
            // TODO: email it
        }
    }

    private void drawDiagram(float armorHeight) throws IOException {
        newStream();
        float heightDiff = armorHeight-92;
        float ma = 1, mb = 0, mc = 0, md = 1, me = 90, mf = 0, x1, y1, x2, y2, ytop = 0, vtop = 0, factor;
        float x=0, y=0, w, h, radius, cx, cy, startAngle, endAngle;
        int carWidth, carHeight, carOffset, startRounded, endRounded;
        boolean fill = false, saved = false, transformed = false, antiClockwise;
        int fillColor = 0xFFFFFF;
        String lines[] = request.draw.split("\\n"), parts[];
        pdf.saveGraphicsState();
        setFont(PDType1Font.HELVETICA, 10);
        for (String line : lines) {
            line = line.trim();
            if(fill && !line.equals("stroke")) {
                pdf.setNonStrokingColor(new Color(fillColor));
                pdf.fill();
            }
            if(line.startsWith("totalSize")) {
                // Max Width: 450  Max Height: 290
                parts = line.split(" ");
                carHeight = (int)Float.parseFloat(parts[1]);
                carWidth = (int)Float.parseFloat(parts[2]);
                carOffset = (int)Float.parseFloat(parts[3]);
                factor = 1f;
                if(carHeight > 290-heightDiff) factor = (290f-heightDiff)/carHeight;
                if(carWidth > 450 && 450f/carWidth < factor) factor = 450f/carWidth;
                ma = factor;
                mb = 0;
                mc = 0;
                md = factor;
                me = (int)(90-carOffset*factor)+(450-(carWidth-carOffset)*factor)/2;
                mf = 0;
                ytop = carHeight+36/factor; // half-inch margin
                pdf.transform(new Matrix(ma, mb, mc, md, me, mf));
            } else if(line.startsWith("version")) {
                version = Integer.parseInt(line.split(" ")[1]);
            } else if(line.startsWith("moveTo")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[1]);
                y = transformed ? (int)Float.parseFloat(parts[2]): ytop-(int)Float.parseFloat(parts[2]);
                pdf.moveTo(x, y);
            } else if(line.startsWith("lineTo")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[1]);
                y = transformed ? (int)Float.parseFloat(parts[2]): ytop-(int)Float.parseFloat(parts[2]);
                pdf.lineTo(x, y);
            } else if(line.startsWith("arc ")) {
                parts = line.split(" ");
                cx = (int)Float.parseFloat(parts[1]);
                cy = transformed ? (int)Float.parseFloat(parts[2]) : ytop-(int)Float.parseFloat(parts[2]);
                radius = (int)Float.parseFloat(parts[3]);
                startAngle = Float.parseFloat(parts[4]);
                endAngle = Float.parseFloat(parts[5]);
                antiClockwise = parts[6].equals("true");
                startRounded = (int)(startAngle*100);
                endRounded = (int)(endAngle*100);
                if (startAngle == 0 && endRounded == 628) {
                    // draw a full circle
                    if (antiClockwise) {
                        drawTopRight(cx, cy, radius, false);
                        drawTopLeft(cx, cy, radius, false);
                        drawBottomLeft(cx, cy, radius, false);
                        drawBottomRight(cx, cy, radius, false);
                    } else {
                        drawBottomRight(cx, cy, radius, true);
                        drawBottomLeft(cx, cy, radius, true);
                        drawTopLeft(cx, cy, radius, true);
                        drawTopRight(cx, cy, radius, true);
                    }
                    x = cx + radius;
                    y = cy;
                } else if (startAngle == 0 && endRounded == 314) {
                    if (antiClockwise) {
                        drawTopRight(cx, cy, radius, false);
                        drawTopLeft(cx, cy, radius, false);
                    } else {
                        drawBottomRight(cx, cy, radius, true);
                        drawBottomLeft(cx, cy, radius, true);
                    }
                    x = cx - radius;
                    y = cy;
                } else if (startAngle == 0 && endRounded == 471) {
                    if (antiClockwise) {
                        drawTopRight(cx, cy, radius, false);
                    } else {
                        drawBottomRight(cx, cy, radius, true);
                        drawBottomLeft(cx, cy, radius, true);
                        drawTopLeft(cx, cy, radius, true);
                    }
                    x = cx;
                    y = cy - radius;
                } else if (startRounded == 314 && endRounded == 628) {
                    if (antiClockwise) {
                        drawBottomLeft(cx, cy, radius, false);
                        drawBottomRight(cx, cy, radius, false);
                    } else {
                        drawTopLeft(cx, cy, radius, true);
                        drawTopRight(cx, cy, radius, true);
                    }
                    x = cx + radius;
                    y = cy;
                } else if (startRounded == 157 && endRounded == 471) {
                    if (antiClockwise) {
                        drawBottomRight(cx, cy, radius, false);
                        drawTopRight(cx, cy, radius, false);
                    } else {
                        drawBottomLeft(cx, cy, radius, true);
                        drawTopLeft(cx, cy, radius, true);
                    }
                } else if (startRounded == 157 && endRounded == 0) {
                    if (antiClockwise) {
                        drawBottomRight(cx, cy, radius, false);
                    } else {
                        drawBottomLeft(cx, cy, radius, true);
                        drawTopLeft(cx, cy, radius, true);
                        drawTopRight(cx, cy, radius, true);
                    }
                    x = cx + radius;
                    y = cy;
                } else if (startRounded == 471 && endRounded == 157) {
                    if (antiClockwise) {
                        drawTopLeft(cx, cy, radius, false);
                        drawBottomLeft(cx, cy, radius, false);
                    } else {
                        drawTopRight(cx, cy, radius, true);
                        drawBottomRight(cx, cy, radius, true);
                    }
                } else if (startRounded == 471 && endRounded == 314) {
                    if (antiClockwise) {
                        drawTopLeft(cx, cy, radius, false);
                    } else {
                        drawTopRight(cx, cy, radius, true);
                        drawBottomRight(cx, cy, radius, true);
                        drawBottomLeft(cx, cy, radius, true);
                    }
                } else if (startRounded == 314 && endRounded == 157) {
                    if (antiClockwise) {
                        drawBottomLeft(cx, cy, radius, false);
                    } else {
                        drawTopLeft(cx, cy, radius, true);
                        drawTopRight(cx, cy, radius, true);
                        drawBottomRight(cx, cy, radius, true);
                    }
                } else {
                    System.err.println("Not drawing start rounded "+startRounded+" End rounded "+endRounded);
                    // Draw a partial arc
                }
            } else if(line.startsWith("arcTo")) {
                parts = line.split(" ");
                x1 = (int)Float.parseFloat(parts[1]);
                y1 = ytop-(int)Float.parseFloat(parts[2]);
                x2 = (int)Float.parseFloat(parts[3]);
                y2 = ytop-(int)Float.parseFloat(parts[4]);
                radius = (int)Float.parseFloat(parts[5]);
                if(y == y1 && x1 == x2) {// first line horizontal
                    if(x1 > x) {// first line horizontal right
                        cx = x1-radius;
                        pdf.lineTo(cx, y);
                        if(y1 > y2) {// second line vertical down
                            cy = y1-radius;
                            drawTopRight(cx, cy, radius, true);
                        } else if(y2 > y1) { // second line vertical up
                            cy = y1+radius;
                            drawBottomRight(cx, cy, radius, false);
                        }
                    } else if(x > x1) { // first line horizontal left
                        cx = x1+radius;
                        pdf.lineTo(cx, y);
                        if(y2 > y1) { // second line vertical up
                            cy = y1 + radius;
                            drawBottomLeft(cx, cy, radius, true);
                        } else if(y1 > y2) {// second line vertical down
                            cy = y1 - radius;
                            drawTopLeft(cx, cy, radius, false);
                        }
                    }
                } else if(x == x1 && y1 == y2) { // first line vertical
                    if(y1 > y) { // first line vertical up
                        cy = y1 - radius;
                        pdf.lineTo(x, cy);
                        if(x2 > x1) { // second line horizontal right
                            cx = x1 + radius;
                            drawTopLeft(cx, cy, radius, true);
                        } else if(x1 > x2) { // second line horizontal left
                            cx = x1 - radius;
                            drawTopRight(cx, cy, radius, false);
                        }
                    } else if(y > y1) { // first line vertical down
                        cy = y1 + radius;
                        pdf.lineTo(x, cy);
                        if(x2 > x1) { // second line horizontal right
                            cx = x1 + radius;
                            drawBottomLeft(cx, cy, radius, false);
                        } else if(x1 > x2) { // second line horizontal left
                            cx = x1-radius;
                            drawBottomRight(cx, cy, radius, true);
                        }
                    }
                } else {
                    pdf.lineTo(x1, y1);
                    pdf.lineTo(x2, y2);
                }
                x = x2;
                y = y2;
            } else if(line.startsWith("quadraticCurveTo")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[3]);
                y = transformed ? (int)Float.parseFloat(parts[4]) : ytop-(int)Float.parseFloat(parts[4]);
                x1 = (int)Float.parseFloat(parts[1]);
                y1 = transformed ? (int)Float.parseFloat(parts[2]) : ytop-(int)Float.parseFloat(parts[2]);
                pdf.curveTo(x1, y1, x, y, x, y);
            } else if(line.startsWith("bezierCurveTo")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[5]);
                y = transformed ? (int)Float.parseFloat(parts[6]) : ytop-(int)Float.parseFloat(parts[6]);
                x1 = (int)Float.parseFloat(parts[1]);
                y1 = transformed ? (int)Float.parseFloat(parts[2]) : ytop-(int)Float.parseFloat(parts[2]);
                x2 = (int)Float.parseFloat(parts[3]);
                y2 = transformed ? (int)Float.parseFloat(parts[4]) : ytop-(int)Float.parseFloat(parts[4]);
                pdf.curveTo(x1, y1, x2, y2, x, y);
            } else if(line.startsWith("rect ")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[1]);
                y = (int)Float.parseFloat(parts[2]);
                w = (int)Float.parseFloat(parts[3]);
                h = (int)Float.parseFloat(parts[4]);
                pdf.moveTo(x, ytop-y);
                pdf.lineTo(x+w, ytop-y);
                pdf.lineTo(x+w, ytop-(y+h));
                pdf.lineTo(x, ytop-(y+h));
                pdf.lineTo(x, ytop-y);
            } else if(line.startsWith("strokeRect")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[1]);
                y = transformed ? (int)Float.parseFloat(parts[2]) : ytop-(int)Float.parseFloat(parts[2]);
                w = (int)Float.parseFloat(parts[3]);
                h = (int)Float.parseFloat(parts[4]);
                pdf.setStrokingColor(Color.BLACK);
                pdf.addRect(x, y-h, w, h);
                pdf.stroke();
            } else if(line.startsWith("fillRect")) {
                parts = line.split(" ");
                x = (int)Float.parseFloat(parts[1]);
                y = transformed ? (int)Float.parseFloat(parts[2]) : ytop-(int)Float.parseFloat(parts[2]);
                w = (int)Float.parseFloat(parts[3]);
                h = (int)Float.parseFloat(parts[4]);
                if(parts.length > 5)
                    fillColor = Integer.parseInt(parts[5].substring(1), 16);
                else
                    fillColor = 0xFFFFFF;
                pdf.setNonStrokingColor(new Color(fillColor));
                pdf.addRect(x, y-h, w, h);
                pdf.fill();
            } else if(line.startsWith("fill ") || line.equals("fill")) {
                fill = true;
                parts = line.split(" ");
                if(parts.length > 1)
                    fillColor = Integer.parseInt(parts[1].substring(1), 16);
                else
                    fillColor=0xFFFFFF;
            } else if(line.equals("stroke")) {
                pdf.setStrokingColor(Color.BLACK);
                if(fill) {
                    pdf.setNonStrokingColor(new Color(fillColor));
                    pdf.fillAndStroke();
                    fill = false;
                } else pdf.stroke();
            } else if(line.startsWith("beginPath")) {
                // This space intentionally left blank
            } else if(line.startsWith("fontSize")) {
                pdf.setFont(font, Integer.parseInt(line.split(" ")[1]));
            } else if(line.startsWith("fillText")) {
                Matcher matcher = Pattern.compile("'(.*)' (-?\\d*\\.?\\d*) (-?\\d*\\.?\\d*)").matcher(line);
                matcher.find();
                String text = matcher.group(1);
                x = (int)Float.parseFloat(matcher.group(2));
                y = (int)Float.parseFloat(matcher.group(3));
                pdf.setNonStrokingColor(Color.BLACK);
                pdf.beginText();
                pdf.newLineAtOffset(x, transformed ? y : ytop-y);
                pdf.showText(text);
                pdf.endText();
            } else if(line.startsWith("closePath")) {
                pdf.closePath();
            } else if(line.startsWith("transform")) {
                if(!saved) {
                    pdf.saveGraphicsState();
                    saved = true;
                }
                parts = line.split(" ");
                ma = Float.parseFloat(parts[1]);
                mb = Float.parseFloat(parts[2]);
                mc = Float.parseFloat(parts[3]);
                md = Float.parseFloat(parts[4]);
                me = Float.parseFloat(parts[5]);
                mf = Float.parseFloat(parts[6]);
                pdf.transform(new Matrix(ma, mb, mc, md, me, vtop-mf));
                transformed = true;
            } else if(line.startsWith("setTransform")) {
                if(saved) { // Always start setTransform from the base state
                    pdf.restoreGraphicsState();
                    saved = false;
                    transformed = false;
                }
                parts = line.split(" ");
                ma = Float.parseFloat(parts[1]);
                mb = Float.parseFloat(parts[2]);
                mc = Float.parseFloat(parts[3]);
                md = Float.parseFloat(parts[4]);
                me = Float.parseFloat(parts[5]);
                mf = Float.parseFloat(parts[6]);
                if(ma != 1 || mb != 0 || mc != 0 || md != 1 || me != 0 || mf != 0) {
                    pdf.saveGraphicsState();
                    saved = true;
                    if(mb == -1 && mc == 1) pdf.transform(new Matrix(ma, -mb, -mc, md, ytop+me, ytop-mf));
                    else if(mb == 1 && mc == -1) pdf.transform(new Matrix(ma, -mb, -mc, md, me-ytop, ytop-mf));
                    else pdf.transform(new Matrix(ma, mb, mc, md, me, mf));
                }
            } else if(line.startsWith("createLinearGradient")) {
            } else System.err.println("UNRECOGNIZED DRAW LINE: "+line);
            if(!line.equals("fill") && !line.startsWith("fill ")) fill = false;
        }
        if(saved) pdf.restoreGraphicsState();
        pdf.restoreGraphicsState();
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
