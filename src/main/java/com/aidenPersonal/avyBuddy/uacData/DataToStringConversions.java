package com.aidenPersonal.avyBuddy.uacData;

import java.io.IOException;
import java.util.HashMap;
import java.util.Scanner;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * This class merely helps to convert the data found in Forecast and Route to readable Strings.
 * 
 * Also contains the SQL connection string for the database because this felt like the right place
 * to put it
 * @author Aiden Pickett
 * @version 10/16/24
 */
public class DataToStringConversions {
		
	//Hash map that takes an integer as a key and gives the appropriate aspect value as a string
	final private static HashMap <Integer, String> roseAspectConversions = new HashMap<>() {
		private static final long serialVersionUID = 1L;
	{
		put(0, "North");
		put(1, "Northeast");
		put(2, "East");
		put(3, "Southeast");
		put(4, "South");
		put(5, "Southwest");
		put(6, "West");
		put(7, "Northwest");
	}};
	
	//Hash map that takes an integer as a key and gives the appropriate elevation value as a string
	
	//Hash map that takes an integer as a key and returns the appropriate elevation value as a string
	final private static HashMap <Integer, String> roseElevationConversions = new HashMap<>() {
		private static final long serialVersionUID = 1L;

	{
		put(0, "Above 8,500 feet");
		put(1, "7,000 - 8,500 feet");
		put(2, "Below 7,000 feet");
	}};
	
	//Hash map that takes an integer as a key and giver the appropriate danger value as a string
	//Hash map that takes an integer as a key and returns the appropriate danger value as a string
	final private static HashMap <Integer, String> roseDangerConversions = new HashMap<>() {
		private static final long serialVersionUID = 1L;
	{
		put(0, "No rating");
		put(1, "Pockets of low danger");
		put(2, "Low danger");
		put(3, "Low danger with pockets of moderate danger");
		put(4, "Moderate danger");
		put(5, "Moderate danger with pockets of considerable danger");
		put(6, "Considerable danger");
		put(7, "Considerable danger with pockets of high danger");
		put(8, "High danger");
		put(9, "High danger with pockets of extreme danger");
		put(10, "Extreme danger");
	}};
	
	
	/**
	 * This method takes in a comma-seperated string and returns an integer array,
	 * where each index is the integer that is separated by a comma
	 * 
	 * @param jsonObject JsonNode-type object that contains the comma-seperated string
	 * @return integer-type array described above
	 * @throws IOException if the JsonNode object provided is a string of no length
	 */
	public static int[] commaSeperatedStringToIntArray(JsonNode jsonObject) throws IOException {
		String[] stringArray = jsonObject.asText().split(",");
		
		if (stringArray.length == 0) {
			throw new IOException("json Object had no string value, must pass string seperated json Object");
		}
		
		int[] seperatedIntArray = new int[stringArray.length];
		Scanner scanner = null;	
		for (int i = 0; i < stringArray.length; i++) {
			scanner = new Scanner(stringArray[i]);
			seperatedIntArray[i] = scanner.nextInt();
		}
		scanner.close();
		return seperatedIntArray;
	}
	
	/**
	 * This method does the same thing as commaSeperatedStringToIntArray, but instead of converting to an
	 * int array it converts to a boolean array where if the int is >= 1 it puts true for that index and
	 * 0 if else. It also takes a string as an input instead (for use by the database)
	 * 
	 * @param commaSeperatedString string to be converted to
	 * @return seperatedBooleanArray as described above, to be used for creating route objects from 
	 * saved database states
	 */
	public static boolean[] commaSeperatedStringToBooleanArray(String commaSeperatedString) {
		
		String[] stringArray = commaSeperatedString.split(",");
		boolean[] seperatedBooleanArray = new boolean[stringArray.length];
		
		Scanner scanner = null;
		for (int i = 0; i < stringArray.length; i++) {
			scanner = new Scanner(stringArray[i]);
			int nextInt = scanner.nextInt();
			if(nextInt == 1) {
				seperatedBooleanArray[i] = true;
			} else {
				seperatedBooleanArray[i] = false;
			}
		}
		scanner.close();
		return seperatedBooleanArray;
	}
	
	/**
	 * This method returns the textual representation of the index of an aspect as a string
	 * 
	 * @param aspectKey index of aspect to get string representation of
	 * @return textual representation aspect
	 */
	public static String getAspectString(int aspectKey) {
		
		//Checks that input is valid
		if(aspectKey > 7 || aspectKey < 0) {
			throw new IllegalArgumentException("Only integers 0-7 are valid arguments for getAspectString");
		}
		return roseAspectConversions.get(aspectKey);
	}
	
	/**
	 * This method returns the textual representation of the index of an elevation as a string
	 * 
	 * @param elevationKey index of a elevation to get string representation of
	 * @return textual representation of elevation
	 */
	public static String getElevationString(int elevationKey) {
		
		//Checks that input is valid
		if(elevationKey > 2 || elevationKey < 0) {
			throw new IllegalArgumentException("Only integers 0-2 are valid arguments for getElevationString");
		}
		return roseElevationConversions.get(elevationKey);
	}
	
	/**
	 * Combination of getAspectString and getElevationString, to get textual representation of a position
	 * 
	 * @param elevation elevation index to get textual representation of
	 * @param aspect aspect index to get textual representation of 
	 * @return textual representation in form of elevation text, aspect text
	 */
	public static String getPositionString(int elevation, int aspect) {
		return getAspectString(aspect) + ", " + getElevationString(elevation);
	}

	/**
	 * returns what a danger value means textually as defined by the Utah Avalanche Center
	 * 
	 * @param danger integer danger to convert to string
	 * @return textual representation of integer danger
	 */
	public static String getDangerString(int danger) {
		
		//checks that input is valid
		if(danger > 10 || danger < 0) {
			throw new IllegalArgumentException("Only integers 0-10 are valid arguments for getDangerString");
		}
		return roseDangerConversions.get(danger);
	}
}
