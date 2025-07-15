package com.aidenPersonal.avyBuddy.RouteFiles;

import com.aidenPersonal.avyBuddy.uacData.Forecast;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * This class manages the connection to the database and allows for adding of routes to
 * said database
 *
 * @author Aiden Pickett
 * @version 10/18/24
 */
public class RouteDatabase {

    //connection string to database
    private static final String url = "jdbc:sqlite:C:/apache-tomcat-11.0.5/lib/database.db";

    /**
     * Makes sure objects of this class cannot be created.
     */
    private RouteDatabase() {}

    /**
     * Gets a database connection for the routes database, used by server
     *
     * @return  A connection to the database
     * @throws SQLException If database connection fails
     * @throws NamingException If namespace doesnt exist in context
     */
    private static Connection getConnection() throws SQLException, NamingException {
        Context initalContext = new InitialContext();
        Context environemntContext = (Context) initalContext.lookup("java:comp/env");
        DataSource dataSource = (DataSource) environemntContext.lookup("jdbc/routesDatabase");
        return dataSource.getConnection();
    }

    /**
     * Writes state of passed route object to database for storage. This includes the name, region, and routePositions
     * instance variables values when they are passed
     *
     * @param route Route object to have state stored
     */
    public static void addRoute(Route route) {
        //Checks that route is not already in database
        if (getRoute(route.getName()) != null) {
            throw new IllegalArgumentException("The route " + route.getName() + " already exists in the database");
        }

        //Establishes database connection
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            //Writes state of passed Route object to database
            String sql = "INSERT INTO routes (name, region, routePositions, description)"
                    + "VALUES ('" + route.getName() + "', '" + route.getRegion() + "', '" + route.getRoutePositionsBinary() + "', '" + route.getDescription() + "')";

            statement.execute(sql);
            connection.close();
            statement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets a given route from the database by the route name. This is guaranteed to be unique
     *
     * @param routeName name of the route to get
     * @return a Route object representing that route
     */
    public static Route getRoute(String routeName) {
        Route returnRoute;
        ResultSet results;

        try {
//            Connection connection = getConnection();
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            String sqlName = "SELECT * FROM routes WHERE name = '" + routeName + "';";
            results = statement.executeQuery(sqlName);

            String name = results.getString("name");
            String region = results.getString("region");
            String dateCreated = results.getString("dateCreated");
            String description = results.getString("description");
            int routePositions = results.getInt("routePositions");
            if (name == null) {
                return null;
            }

            returnRoute = new Route(region, name, dateCreated, description);
            returnRoute.setNewRoutePositionsBinary(routePositions);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } //catch (NamingException e) {
//            throw new RuntimeException(e);
//        }

        return returnRoute;
    }

    /**
     * Edits the positions and region of a route already in the database, by route name.
     *
     * @param routeName         name of the route to edit in the database
     * @param newRegion         the new region of the route
     * @param newRoutePositions the new positions of the route, encoded to an integer
     */
    public static void editRoute(String routeName, String newRegion, boolean[] newRoutePositions) {
        if (newRoutePositions.length != 24)
            throw new IllegalArgumentException("the length of the newRoutePositions array must be 24");
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            int newRoutePositionsBinary = getBinaryRoutePositions(newRoutePositions);

            String sql = "UPDATE routes SET routePositions = " + newRoutePositionsBinary + ", region = '" + newRegion + "' WHERE name = '" + routeName + "';";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Edits the positions of a route already in the database, by route name.
     *
     * @param routeName         name of the route to edit in the database
     * @param newRoutePositions the new positions of the route, encoded to an integer
     */
    public static void editRoute(String routeName, boolean[] newRoutePositions) {
        if (newRoutePositions.length != 24)
            throw new IllegalArgumentException("the length of the newRoutePositions array must be 24");
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            int newRoutePositionsBinary = getBinaryRoutePositions(newRoutePositions);

            String sql = "UPDATE routes SET routePositions = " + newRoutePositionsBinary + " WHERE name = '" + routeName + "';";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Edits the region of a route already in the database, by route name.
     *
     * @param routeName         name of the route to edit in the database
     * @param newRegion         The new region to be set
     */
    public static void editRoute(String routeName, String newRegion) {
        if (!Arrays.asList(Forecast.validRegions).contains(newRegion)) {
            throw new IllegalArgumentException("Invalid region name, only logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, and southwest are valid region names, default forecast created instead");
        }

        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            String sql = "UPDATE routes SET region = '" + newRegion + "' WHERE name = '" + routeName + "';";
            statement.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Helper method that converts a boolean array of route positions into a binary number that represents it
     * to be used by the database
     *
     * @param newRoutePositions boolean array of route positions
     * @return integer representing the positions
     */
    private static int getBinaryRoutePositions(boolean[] newRoutePositions) {
        int newRoutePositionsBinary = 0;
        boolean[] routePositionsReversed = newRoutePositions.clone();

        int left = 0;
        int right = routePositionsReversed.length - 1;
        while (left < right) {
            boolean temp = routePositionsReversed[left];
            routePositionsReversed[left] = routePositionsReversed[right];
            routePositionsReversed[right] = temp;
            left++;
            right--;
        }

        for (int i = routePositionsReversed.length - 1; i >= 0; i--) {
            boolean b = routePositionsReversed[i];
            if (b) {
                newRoutePositionsBinary = newRoutePositionsBinary | 1 << i;
            } else {
                newRoutePositionsBinary = newRoutePositionsBinary & ~(1 << i);
            }
        }

        return newRoutePositionsBinary;
    }

    /**
     * This method deletes a route from the database
     *
     * @param routeName name of the route to delete
     */
    public static void deleteRoute(String routeName) {
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            String sql = "DELETE FROM routes WHERE name = '" + routeName + "';";

            statement.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets a list of the route names currently in the database
     *
     * @return a list of route names currently in the database
     */
    public static List<String> getRouteNamesInDatabase() {
        ResultSet results;
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            results = statement.executeQuery("SELECT name FROM routes;");
            ArrayList<String> routeNames = new ArrayList<>();

            while (results.next()) {
                routeNames.add(results.getString("name"));
            }

            return routeNames;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets a list of the route names currently in the database, ordered by the date of creation (newest-to-oldest)
     *
     * @param region region of the routes to be returned
     * @return a list of route names currently in the database
     */
    public static List<Route> getRoutesOrderedByRecency(String region) {
        ResultSet results;
        try {
//            Connection connection = getConnection();
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            results = statement.executeQuery("SELECT * FROM routes WHERE region is '" + region + "' ORDER BY routes.dateCreated DESC");
            ArrayList<Route> routes = new ArrayList<>();

            while (results.next()) {
                Route route = new Route(results.getString("region"), results.getString("name"), results.getString("dateCreated"), results.getString("description"));
                route.setNewRoutePositionsBinary(results.getInt("routePositions"));
                routes.add(route);
            }

            return routes;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } //catch (NamingException e) {
//            throw new RuntimeException(e);
//        }
    }

    /**
     * Sorts the routes of a given region by the forecast data
     *
     * @param region the region to get the forecast to sort the routes by
     * @return A list of the routes
     */
    public static List<Route> getRoutesOrderedByForecast(String region) {
        ResultSet results;
        try {
            var connection = DriverManager.getConnection(url);
            var statement = connection.createStatement();

            results = statement.executeQuery("SELECT * FROM routes WHERE region is '" +  region + "' ORDER BY routes.dateCreated DESC");
            ArrayList<Route> routes = new ArrayList<>();

            while (results.next()) {
                Route route = new Route(results.getString("region"), results.getString("name"), results.getString("dateCreated"), results.getString("description"));
                route.setNewRoutePositionsBinary(results.getInt("routePositions"));
                routes.add(route);
            }

            routes.sort(new RouteComparator(region));

            return routes;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
