package com.aidenPersonal.avyBuddy.RouteFiles;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * This class manages the connection to the database and allows for adding of
 * routes to
 * said database
 *
 * @author Aiden Pickett
 * @version 10/18/24
 */
public class RouteDatabase {

    // connection string to database
    private static final String url = "jdbc:sqlite:C:/Users/ka7nq/webProjects/avyBuddy/src/main/resources/database.db";

    /**
     * Makes sure objects of this class cannot be created.
     */
    private RouteDatabase() {
    }

    /**
     * Writes state of passed route object to database for storage. This includes
     * the name, region, and routePositions
     * instance variables values when they are passed
     *
     * @param route Route object to have state stored
     */
    public void addRoute(Route route) {
        // Checks that route is not already in database
        if (getRoute(route.getId()) != null) {
            throw new IllegalArgumentException("The route " + route.getName() + " already exists in the database");
        }

        // Establishes database connection
        try {
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            // Writes state of passed Route object to database
            String sql = "INSERT INTO routes (name, region, routePositions, description)"
                    + "VALUES ('" + route.getName() + "', '" + route.getRegion() + "', '"
                    + route.getRoutePositionsBinary() + "', '" + route.getDescription() + "');";

            statement.execute(sql);
            dbConnection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets a route from the database with a given id
     *
     * @param routeName name of the route to get
     * @return a Route object representing that route, or null if there is none with
     *         that ID
     */
    public Route getRoute(int routeId) {
        Route returnRoute;
        ResultSet results;

        try {
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            String sqlName = "SELECT * FROM routes WHERE id = '" + routeId + "';";
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
            dbConnection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return returnRoute;
    }

    /**
     * Edits a route already in the database
     *
     * @param routeId           id of the route to edit
     * @param newRouteName      the new name for this route
     * @param newRegion         the new region for this route
     * @param newRoutePositions the new route positions for this route
     * @param newDescription    the new description for this route
     * @implNote Everything except for routeName can be a null value and still be
     *           valid, this allows
     *           for patch requests to work
     */
    public static void editRoute(int routeId, String newRouteName, String newRegion, boolean[] newRoutePositions,
            String newDescription) {
        if (newRegion == null && newRoutePositions == null && newDescription == null) {
            return;
        }
        try {
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            String sql = "UPDATE routes SET ";
            if (newRouteName != null) {
                sql += "name = '" + newRouteName + "' , ";
            }
            if (newRegion != null) {
                sql += "region = '" + newRegion + "' , ";
            }
            if (newRoutePositions != null) {
                sql += "routePositions = '" + getBinaryRoutePositions(newRoutePositions) + "' , ";
            }
            if (newDescription != null) {
                sql += "description = '" + newDescription + "' , ";
            }
            sql = sql.substring(0, sql.length() - 2);
            sql += "WHERE id = '" + routeId + "';";
            statement.execute(sql);
            dbConnection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Helper method that converts a boolean array of route positions into a binary
     * number that represents it
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
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            String sql = "DELETE FROM routes WHERE name = '" + routeName + "';";

            statement.execute(sql);
            dbConnection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Gets a list of the route names currently in the database, ordered by the date
     * of creation (newest-to-oldest)
     *
     * @param region region of the routes to be returned
     * @return a list of route names currently in the database
     */
    public static List<Route> getRoutesOrderedByRecency(String region) {
        ResultSet results;
        try {
            // Connection connection = getConnection();
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            results = statement.executeQuery(
                    "SELECT * FROM routes WHERE region is '" + region + "' ORDER BY routes.dateCreated DESC");
            ArrayList<Route> routes = new ArrayList<>();

            while (results.next()) {
                Route route = new Route(results.getString("region"), results.getString("name"),
                        results.getString("dateCreated"), results.getString("description"));
                route.setNewRoutePositionsBinary(results.getInt("routePositions"));
                routes.add(route);
            }

            dbConnection.close();

            return routes;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
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
            var dbConnection = DriverManager.getConnection(url);
            var statement = dbConnection.createStatement();

            results = statement.executeQuery(
                    "SELECT * FROM routes WHERE region is '" + region + "' ORDER BY routes.dateCreated DESC");
            ArrayList<Route> routes = new ArrayList<>();

            while (results.next()) {
                Route route = new Route(results.getString("region"), results.getString("name"),
                        results.getString("dateCreated"), results.getString("description"));
                route.setNewRoutePositionsBinary(results.getInt("routePositions"));
                routes.add(route);
            }

            routes.sort(new RouteComparator(region));

            dbConnection.close();

            return routes;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
