package org.opentools.carwars.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.zip.GZIPInputStream;

/**
 * Serves gzipped PDFs and plain PNGs
 */
public class ContentServer extends HttpServlet {
    private File dataDir;

    public ContentServer() {
        dataDir = new File(System.getenv("OPENSHIFT_DATA_DIR"));
        if(!dataDir.isDirectory() || !dataDir.canRead() || !dataDir.canWrite())
            throw new IllegalArgumentException("Invalid setting for $OPENSHIFT_DATA_DIR: "+dataDir.getAbsolutePath());
        dataDir = new File(dataDir, "content");
        if(!dataDir.isDirectory() || !dataDir.canRead() || !dataDir.canWrite())
            throw new IllegalArgumentException("Invalid content directory under $OPENSHIFT_DATA_DIR: "+dataDir.getAbsolutePath());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        boolean gzip = false;
        String filePath = req.getPathInfo();
        // Only serves two kinds of files: *.pdf (stored as *.pdf.gz on disk) and *.png
        if(filePath.endsWith(".pdf")) {
            filePath += ".gz";
            gzip = true;
        } else if(!filePath.endsWith(".png")) {
            resp.sendError(resp.SC_FORBIDDEN);
            return;
        }
        File source = new File(dataDir, filePath);
        if(!source.exists() || !source.canRead()) {
            resp.sendError(resp.SC_NOT_FOUND);
            return;
        }
        byte[] buf = new byte[2000];
        InputStream in = new FileInputStream(source);
        if(gzip) {
            if(req.getHeader("Accept-Encoding") != null && req.getHeader("Accept-Encoding").contains("gzip")) {
                resp.setHeader("Content-Encoding", "gzip");
                resp.setContentLength((int)source.length());
            } else {
                in = new GZIPInputStream(in);
            }
            resp.setContentType("application/pdf");
        } else {
            resp.setContentType("image/png");
            resp.setContentLength((int)source.length());
        }
        resp.setDateHeader("Last-Modified", source.lastModified());
        resp.setHeader("Cache-Control", "max-age=86400");
        resp.setDateHeader("Expires", System.currentTimeMillis()+86400000);
        int count;
        OutputStream out = resp.getOutputStream();
        while((count = in.read(buf)) != -1) {
            out.write(buf, 0, count);
        }
        out.close();
    }
}
