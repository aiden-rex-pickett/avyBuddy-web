package com.aidenPersonal.avyBuddy.RouteFiles;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * This class manages the connection to the database and allows for adding of routes to
 * said database
 * 
 * @author Aiden Pickett
 * @version 10/18/24
 */
public class RouteDatabase {
	
	//connection string to database
	static final String url = "jdbc:sqlite:C:/Users/ka7nq/Desktop/avyBuddy/src/main/resources/database.db";
	
	/**
	 * Writes state of passed route object to database for storage. This includes the name, region, and routePositions
	 * instance variables values when they are passed
	 * 
	 * @param route Route object to have state stored
	 * @return true if a route was added, false if not
	 */
	public static boolean addRoute(Route route) {
		
		//Checks that route is not already in database
		if (getRoute(route.getName()) != null) {
			throw new IllegalArgumentException("The route " + route.getName() + " already exists in the database");
		}
		
		//Establishes database connection
		try {
			var connection = DriverManager.getConnection(url);
			var statement = connection.createStatement();
			
			//Writes state of passed Route object to database
			String sql = "INSERT INTO routes (name, region, routePositions)"
					+ "VALUES ('" + route.getName() + "', '" + route.getRegion() + "', '" + route.getRoutePositionsBinary() + "')";
			
			statement.execute(sql);
			connection.close();
			statement.close();
		} catch (SQLException e) {
			return false;
		}
		return true;
	}

	public static Route getRoute(String routeName) {
		Route returnRoute = null;
		ResultSet results;

		try {
			var connection = DriverManager.getConnection(url);
			var statement = connection.createStatement();

			String sqlName = "SELECT * FROM routes WHERE name = '" + routeName + "';";
			results = statement.executeQuery(sqlName);

			String name = results.getString("name");
			String region = results.getString("region");
			int routePositions = results.getInt("routePositions");
			if(name == null) {
				return returnRoute;
			}

			returnRoute = new Route(region, name);
			returnRoute.setNewRoutePositionsBinary(routePositions);
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}

		return returnRoute;
	}

}
