package com.aidenPersonal.avyBuddy.RouteFiles;

import com.aidenPersonal.avyBuddy.uacData.DataToStringConversions;
import com.aidenPersonal.avyBuddy.uacData.Forecast;

import java.io.IOException;
import java.util.Arrays;

/**
 * This class creates objects that represent routes in the backcountry. These contain the aspects and elevations of concern,
 * where a backcountry user might pass through.
 * 
 * @author Aiden Pickett
 * @version 10/16/24
 */
public class Route implements Comparable<Route>{

	//Array of booleans to represent if the position (aspect and elevation) is present in the route
	private boolean[] routePositions = new boolean[24];
	
	//region where the route exists, or what region to pull data from when analyzed
	private final String region;
	
	//name of the route
	private String name;
	
	/**
	 * Default constructor, for creating hollow Route Objects. Not to be used by user as it would conflict with compareTo method
	 * 
	 * @param region region of where to get avalanche forecast data from
	 * @param name string name of the Route
	 */
	public Route(String region, String name) {
		//checks that region is valid
		if(!Arrays.asList(Forecast.validRegions).contains(region)) {
			throw new IllegalArgumentException("Invalid region name, only logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, and southwest are valid region names, default forecast created instead");
		} else {
			this.region = region;
		}
		
		this.name = name;
	}
	
	/**
	 * Constructor for Route object, where you can provide some initial aspects and elevations
	 * to be added
	 * 
	 * @param region region where the route will take place
	 * @param aspect integer of 0-7, where 0 is north, 1 is northeast, etc
	 * @param elevation integer of 0-2, where 2 is the lowest elevation band and 0 is the highest
	 */
	public Route(String region, String name, int elevation, int...aspect){
		//Checks that region is valid
		if(!Arrays.asList(Forecast.validRegions).contains(region)) {
			throw new IllegalArgumentException("Invalid region name, only logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, and southwest are valid region names, default forecast created instead");
		} else {
			this.region = region;
		}
		//adds initial 
		addRouteDanger(elevation, aspect);
		
		this.name = name;
	}
	
	/**
	 * Setter for routePositions array, used to know if a certain position (aspect and elevation) is included
	 * in the Route
	 * 
	 * @param aspect integer of 0-7, where 0 is north, 1 is northeast, etc
	 * @param elevation integer of 0-2, where 2 is the lowest elevation band and 0 is the highest
	 */
	public void addRouteDanger(int elevation, int... aspect) {
		
		//Check to see that inputs are valid
		for(int num : aspect) {
			if (num > 7 || num < 0) {
				throw new IllegalArgumentException("Only values between 0 and 7 inclusive are allowed for the aspect argument");
			}
		}
		if(elevation > 2 || elevation < 0) {
			throw new IllegalArgumentException("Only values between 0 and 2 inclusive are allowed for the elevation argument");
		}
		
		//Changes corresponding indices in aspects array to the danger value of the forecast to 
		//represent that they are a part of the tour
		for (int i = 0; i < routePositions.length; i++) {
        for (int k : aspect) {
            if (i == elevation * 8 + k) {
                routePositions[i] = true;
                break;
            }
        }
		}
	}
	
	/**
	 * This function replaces the current array of positions with a new one, mainly for use with the database
	 * 
	 * @param newArray new 24 length boolean array to add
	 */
	public void addNewRoutePositions(boolean[] newArray) {
		if (newArray.length == routePositions.length) {
			routePositions = newArray;
		} else {
			throw new IllegalArgumentException("Only boolean arrays of length 24 are valid");
		}
	}
	
	/**
	 * getter for the routePositions array
	 * 
	 * @return the routePositions array, which is an array of boolean values that represents if the position (aspect and elevation)
	 * are a part of the route.
	 */
	public boolean[] getRoutePositions() {
		return routePositions;
	}
	
	/**
	 * getter for an integer array that gets the most current avalanche data and applies it to positions (aspect and elevation) that
	 * is part of the route. The region is the one defined as a part of this Route object
	 * 
	 * @return integer array, where the positions of the tour (aspect and elevation) are filled in with the avalanche data danger at the
	 * time of the function call. As always, 1 is pockets of low danger, 2 is low danger, 3 is low with pockets of moderate,... up to 10
	 * which is extreme. If there is an IOExepiton, it returns a list where all positions are at danger 0.
	 */
	public int[] getOverallDangerPositionsForRoute() {
		
		int[] returnArray = new int[routePositions.length];
		Forecast forecast;
		
		//gets most recent forecast
		try {
			forecast = new Forecast(region);
		} catch (IOException e) {
			//In case of IOException it returns the array described in the Javadoc
			return returnArray;
		}
		
		int[] mainRoseArray = forecast.getmain_rose_array();
		for(int i = 0; i < routePositions.length; i++) {
			if(routePositions[i]) {
				returnArray[i] = mainRoseArray[i];
			}
		}
		
		return returnArray;
	}
	
	/**
	 * getter for the region of where the route exists
	 * 
	 * @return region described above
	 */
	public String getRegion() {
		return region;
	}
	
	/**
	 * Getter for name of the Route object
	 * 
	 * @return name of route
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Setter for the name of the Route object
	 * 
	 * @param name new name of this Route object
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * String representation of this Route object
	 */
	public String toString() {
		String returnString = "Route: " + getName() + " || Region: " + getRegion() + "\nThis route passes through: \n";
		for (int i = 0; i < routePositions.length; i++) {
			if(routePositions[i]) {
				returnString += "- " + DataToStringConversions.getAspectString(i%8) + " " + DataToStringConversions.getElevationString(i/8) + "\n";
			}
		}
		return returnString;
	}

	@Override
  public int compareTo(Route other) {
		
		double thisAverageDanger = averageDanger(this);
		double otherAverageDanger = averageDanger(other);

      return Double.compare(thisAverageDanger, otherAverageDanger);
	}
	
	/**
	 * Private helper method that calculates the average danger of a Route object
	 * 
	 * @param route Route object to calculate average danger of
	 * @return double type value which represents the average danger
	 */
	private double averageDanger(Route route) {
		
		double routeTotalDanger = 0.0;
		double numberOfPositions = 0.0;
		int[] routeOverallDanger = route.getOverallDangerPositionsForRoute();
		
		for (int num : routeOverallDanger) {
			if (num != 0) {
				routeTotalDanger += num;
				numberOfPositions++;
			}
		}
		
		return routeTotalDanger / numberOfPositions;
	}
	
}
