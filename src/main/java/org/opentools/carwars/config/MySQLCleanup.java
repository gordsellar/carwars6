package org.opentools.carwars.config;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

/**
 * Avoid leaks on shutdown
 */
@WebListener
public class MySQLCleanup implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        System.err.println("************ SHUTDOWN START");
        try {
            System.err.println("Calling MySQL AbandonedConnectionCleanupThread shutdown");
            com.mysql.jdbc.AbandonedConnectionCleanupThread.shutdown();

        } catch (InterruptedException e) {
            System.err.println("Error calling MySQL AbandonedConnectionCleanupThread shutdown");
            e.printStackTrace();
        }

        ClassLoader cl = Thread.currentThread().getContextClassLoader();

        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();

            if (driver.getClass().getClassLoader() == cl) {

                try {
                    System.err.println("Deregistering JDBC driver "+driver.getClass().getName());
                    DriverManager.deregisterDriver(driver);

                } catch (SQLException ex) {
                    System.err.println("Error deregistering JDBC driver "+driver.getClass().getName());
                    ex.printStackTrace();
                }

            } else {
                System.err.println("Not deregistering JDBC driver "+driver.getClass().getName()+" as it does not belong to this webapp's ClassLoader");
            }
        }
        System.err.println("************ SHUTDOWN FINISH");
    }
}
