package com.aidenPersonal.avyBuddy.uacData;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.NoSuchElementException;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * This class represents relevant the data that is pulled from the Utah Avalanche Center API.
 * This includes all the avalanche roses, bottom line statement, overall avy danger, region, and date issued.
 * 
 * @author Aiden Pickett
 * @version 10/14/24
 */
public class Forecast {

	private int[] mainRoseArray;
	
	//Named this way because that is how it is put in the Json endpoint,
	//Because I made this in the summer I am unsure what roses these values represent
	//Update: they likely represent the individual avalanche problem roses
	private int[] dangerRose1;
	private int[] dangerRose2;
	private int[] dangerRose3;
	
	private String overallAvyDanger;
	private String bottomLine;
	private String dateIssued;
	//The reason for this variable is that the region from the Json endpoint is not the same as the
	//region argument imputed for this constructor, so this variable is here so that it can be used
	//to create further forecasts with the same region value without having to type out the string literal 
	private String passedRegion;
	
	//list of valid region arguments for constructor
	public static String[] validRegions = {"logan", "ogden", "uintas", "salt-lake", "provo", "skyline", "moab", "abajos", "southwest"};

	/**
	 * Overloaded constructor that makes a generic Forecast object
	 */
  public Forecast() {
		mainRoseArray = new int[24];
		dangerRose1 = new int[24];
		dangerRose2 = new int[24];
		dangerRose3 = new int[24];

		overallAvyDanger = "NO VALUE FOUND";
		bottomLine = "NO VALUE FOUND";
		dateIssued = "NO VALUE FOUND";
		passedRegion = "NO VALUE PROVIDED";
	}
	
	/**
	 * Constructor that makes a new Forecast object with the json endpoint data of the region passed
	 * 
	 * @param region name of region to fetch data from. Valid region names are as follows:
	 * logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, southwest
	 * @throws IOException if the url is incorrectly inputed or region is not valid
	 * (did not consider cases where UAC is down, maybe something to do in the future
	 */
  public Forecast(String region) throws IOException{
		passedRegion = region;
		
		if(!Arrays.asList(validRegions).contains(region)) {
			throw new IllegalArgumentException("Invalid region name, only logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, and southwest are valid region names, default forecast created instead");
		}
		@SuppressWarnings("deprecation")
		
		//Opens URL connection and attempts to make connection
		URL endpoint = new URL("https://utahavalanchecenter.org/forecast/" + region + "/json");
		
			HttpsURLConnection connection = (HttpsURLConnection) endpoint.openConnection();
			connection.setRequestMethod("GET");
			int responseCode = connection.getResponseCode();
			
			if(responseCode == 200) {
				//If connection is successfully made, organizeForecast is called to parse JSON data
				organizeForecastData(connection);
			} else {
				//If connection is not successfully made an IOException is thrown
				throw new IOException("Incorrect URL, likely region misspelled or incorrect");
			}
	}
	
	/**
	 * Private helper method that organizes backend avalanche forecast data and saves the private instance variables
	 * 
	 * @param connection HttpsURLConnection-type object that is the connection to the json endpoint, as in
	 * line with the jackson fasterxml library usage
	 * @throws IOException if an IO exception occurs in getInputStream method, usually from invalid connection being passed
	 * @see getInputStream
	 */
	private void organizeForecastData(HttpsURLConnection connection) throws IOException{
		
		//Opens scanner and catches potential IOException
		Scanner scanner;
		String input = "";
		scanner = new Scanner(connection.getInputStream());
			
		//Checks that connection had a value
		try {
			input = scanner.nextLine();
		} catch (NoSuchElementException e) {
			System.out.println("Void JSON return");
			scanner.close();
			return;
		}
		scanner.close();
		
		//Creates objectMapper to parse JSON response object
		ObjectMapper object = new ObjectMapper();
		ArrayNode rootNode;
		JsonNode dataNode;
		
		//creates dataNode object that contains all data from first advisory in advisory list, there will only ever be one
		//Catches all exceptions arising from readTree method
		try {
			rootNode = (ArrayNode) object.readTree(input).path("advisories");
			dataNode = rootNode.get(0).path("advisory");
		} catch (JsonMappingException e) {
			System.out.println("Internal error, please try again");
			e.printStackTrace();
			return;
		} catch (JsonProcessingException e) {
			System.out.println("Internal error, please try again");
			e.printStackTrace();
			return;
		}
		
		//Sets instance variables according to JSON response
		//Sets only important ones, namely all the forecast rose arrays, overall danger, bottom line text that appears at the
		//top of the webpage and the date issued
		overallAvyDanger = dataNode.get("overall_danger_rating").asText();
		bottomLine = dataNode.get("bottom_line").asText();
		dateIssued = dataNode.get("date_issued").asText();
		
		mainRoseArray = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("overall_danger_rose"));
		dangerRose1 = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("danger_rose_1"));
		dangerRose2 = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("danger_rose_2"));
		dangerRose3 = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("danger_rose_3"));
	}
	
	/**
	 * getter for overallAvyDanger String
	 * 
	 * @return overallAvyDanger String which represents the overall danger for the day, ranging from None to Extreme
	 */
	public String getAvyDanger() {
		return overallAvyDanger;
	}

	/**
	 * getter for bottomLine string
	 * 
	 * @return the bottomLine, which is a string that represents the "Bottom Line" statement on the Forecast, which
	 * is made by the Utah Avalanche Center and gives a bottom line about avalanche danger for the day
	 */
	public String getBottomLine() {
		return bottomLine;
	}
	
	/**
	 * getter for dateIssued string
	 * 
	 * @return the dateIssued string, which is exactly what it sounds like
	 */
	public String getDateIssued() {
		return dateIssued;
	}
	
	/**
	 * getter for passedRegion
	 * 
	 * @return the region string passed to make this Forecast object, a more pretty and suitable version can
	 * be accessed with the getRegion method, which returns the one found in the Json endpoint
	 * @see getRegion
	 */
	public String getPassedRegion() {
		return passedRegion;
	}
	
	/*
	 * getter for mainRoseArray
	 * 
	 * @return mainRoseArray which represents the values on the rose with an integer from 0-10 where 0
	 * is no rating, 1 is pockets of low danger, 2 is low, 3 is low with pockets of moderate danger,up
	 * to 10 being extreme danger. As with all rose arrays, the first index is the highest north face, the second the highest
	 * northeast face, and so on and descending from there. See the Utah Avalanche Center forecast JSON page for more
	 * information
	 * @see https://utahavalanchecenter.org/docs/api/forecast
	 */
	public int[] getMainRoseArray() {
		return mainRoseArray;
	}

	/**
	 * returns dangerRose1 which represents an avalanche problem rose
	 * 
	 * @return the dangerRose1 integer array, which represents an avalanche problem. This rose is different than
	 * the overall rose however, as it is binary. each index will either be 0, representing a face and elevation
	 * where the problem is not forecasted to occur, or 14, which is a face and elevation where the problem is
	 * forecasted to occur. As with all rose arrays, the first index is the highest north face, the second the highest
	 * northeast face, and so on and descending from there. See the Utah Avalanche Center forecast JSON page for more
	 * information
	 * @see https://utahavalanchecenter.org/docs/api/forecast
	 */
	public int[] getDangerRose1() {
		return dangerRose1;
	}

	/**
	 * returns dangerRose2 which represents an avalanche problem rose
	 * 
	 * @return the dangerRose2 integer array, which represents an avalanche problem. This rose is different than
	 * the overall rose however, as it is binary. each index will either be 0, representing a face and elevation
	 * where the problem is not forecasted to occur, or 14, which is a face and elevation where the problem is
	 * forecasted to occur. As with all rose arrays, the first index is the highest north face, the second the highest
	 * northeast face, and so on and descending from there. See the Utah Avalanche Center forecast JSON page for more
	 * information
	 * @see https://utahavalanchecenter.org/docs/api/forecast
	 */
	public int[] getDangerRose2() {
		return dangerRose2;
	}

	/**
	 * returns dangerRose3 which represents an avalanche problem rose
	 * 
	 * @return the dangerRose3 integer array, which represents an avalanche problem. This rose is different than
	 * the overall rose however, as it is binary. each index will either be 0, representing a face and elevation
	 * where the problem is not forecasted to occur, or 14, which is a face and elevation where the problem is
	 * forecasted to occur. As with all rose arrays, the first index is the highest north face, the second the highest
	 * northeast face, and so on and descending from there. See the Utah Avalanche Center forecast JSON page for more
	 * information
	 * @see https://utahavalanchecenter.org/docs/api/forecast
	 */
	public int[] getDangerRose3() {
		return dangerRose3;
	}

}
