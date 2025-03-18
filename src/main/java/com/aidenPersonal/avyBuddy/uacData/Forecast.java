package com.aidenPersonal.avyBuddy.uacData;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.NoSuchElementException;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * This class represents relevant the data that is pulled from the Utah Avalanche Center API.
 * This includes all the avalanche roses, bottom line statement, overall avy danger, region, and date issued.
 *
 * @author Aiden Pickett
 * @version 02/27/25
 */
public class Forecast {

    private int[] mainRose;

    //Named this way because that is how it is put in the Json endpoint,
    //Because I made this in the summer I am unsure what roses these values represent
    //Update: they likely represent the individual avalanche problem roses
    AvalancheProblem avy_problem_1 = null;
    AvalancheProblem avy_problem_2 = null;
    AvalancheProblem avy_problem_3 = null;

    private String overall_avy_danger;
    private String bottom_line;
    private String date_issued;
    //The reason for this variable is that the region from the Json endpoint is not the same as the
    //region argument imputed for this constructor, so this variable is here so that it can be used
    //to create further forecasts with the same region value without having to type out the string literal
    private final String passed_region;

    //list of valid region arguments for constructor
    public static final String[] validRegions = {"logan", "ogden", "uintas", "salt-lake", "provo", "skyline", "moab", "abajos", "southwest"};

    /**
     * Overloaded constructor that makes a generic Forecast object, mostly used if api endpoint doesn't hit
     */
    public Forecast() {
        mainRose = new int[24];
        AvalancheProblem avy_problem_1 = new AvalancheProblem(new int[24], "NO VALUE FOUND", "NO VALUE FOUND");
        AvalancheProblem avy_problem_2 = new AvalancheProblem(new int[24], "NO VALUE FOUND", "NO VALUE FOUND");
        AvalancheProblem avy_problem_3 = new AvalancheProblem(new int[24], "NO VALUE FOUND", "NO VALUE FOUND");

        overall_avy_danger = "NO VALUE FOUND";
        bottom_line = "NO VALUE FOUND";
        date_issued = "NO VALUE FOUND";
        passed_region = "NO VALUE PROVIDED";
    }

    /**
     * Constructor that makes a new Forecast object with the json endpoint data of the region passed
     *
     * @param region name of region to fetch data from. Valid region names are as follows:
     *               logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, southwest
     * @throws IOException if the url is incorrectly inputted or region is not valid
     *                     (did not consider cases where UAC is down, maybe something to do in the future
     */
    public Forecast(String region) throws IOException {
        passed_region = region;

        if (!Arrays.asList(validRegions).contains(region)) {
            throw new IllegalArgumentException("Invalid region name, only logan, ogden, uintas, salt-lake, provo, skyline, moab, abajos, and southwest are valid region names, default forecast created instead");
        }

        //Opens URL connection and attempts to make connection
        URL endpoint = new URL("https://utahavalanchecenter.org/forecast/" + region + "/json");

        HttpsURLConnection connection = (HttpsURLConnection) endpoint.openConnection();
        connection.setRequestMethod("GET");
        int responseCode = connection.getResponseCode();

        if (responseCode == 200) {
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
     *                   line with the jackson fasterxml library usage
     * @throws IOException if an IO exception occurs in getInputStream method, usually from invalid connection being passed
     */
    private void organizeForecastData(HttpsURLConnection connection) throws IOException {

        //Opens scanner and catches potential IOException
        Scanner scanner;
        String input;
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
        } catch (JsonProcessingException e) {
            System.out.println("Internal error, please try again");
            e.printStackTrace();
            return;
        }

        //Sets instance variables according to JSON response
        //Sets only important ones, namely all the forecast rose arrays and their meaning, overall danger,
        //bottom line text that appears at the top of the webpage and the date issued
        overall_avy_danger = dataNode.get("overall_danger_rating").asText();
        bottom_line = removeNBSPAtEndAndBeginning(dataNode.get("bottom_line").asText());
        date_issued = dataNode.get("date_issued").asText();

        mainRose = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("overall_danger_rose"));
        if (dataNode.get("avalanche_problem_1") != null) {
            avy_problem_1 = getAvalancheProblem(dataNode, 1);
        }
        if (dataNode.get("avalanche_problem_2") != null) {
            avy_problem_2 = getAvalancheProblem(dataNode, 2);
        }
        if (dataNode.get("avalanche_problem_3") != null) {
            avy_problem_3 = getAvalancheProblem(dataNode, 3);
        }
    }

    private AvalancheProblem getAvalancheProblem(JsonNode dataNode, int problemId) throws IOException {
        int[] dangerArray = DataToStringConversions.commaSeperatedStringToIntArray(dataNode.get("danger_rose_" + problemId));
        String problemTitle = dataNode.get("avalanche_problem_" + problemId).asText();
        String problemDescription = removeNBSPAtEndAndBeginning(dataNode.get("avalanche_problem_" + problemId + "_description").asText());
        return new AvalancheProblem(dangerArray, problemTitle, problemDescription);
    }

    /**
     * This method removes all the annoying non-breaking spaces and \r escapes
     * that the UAC puts at the end and beginning of their api endpoint
     */
    private String removeNBSPAtEndAndBeginning(String string) {
        char[] expectedToken = new char[] {';', 'p', 's', 'b', 'n', '&'};
        int pointer = string.length();
        while (true) {
            if (string.charAt(pointer - 1) != '\r' && string.charAt(pointer - 1) != ';') {
                break;
            }

            if (string.charAt(pointer - 1) == expectedToken[0]) {
                boolean nbspSequence = true;
                for (int i = pointer - 2, j = 1; i > pointer - 1 - expectedToken.length; i--, j++) {
                    if (string.charAt(i) != expectedToken[j]) {
                         nbspSequence = false;
                         break;
                    }
                }
                if (nbspSequence) {
                    pointer -= 6;
                } else {
                    break;
                }
            } else {
                pointer--;
            }
        }

        String strippedString = string.substring(0, pointer);

        while (strippedString.charAt(0) == '\r' || strippedString.charAt(0) == '&') {
            if (strippedString.charAt(0) == '&') {
                strippedString = strippedString.replaceFirst("&nbsp;", "");
            } else {
                strippedString = strippedString.replaceFirst("\r", "");
            }
        }

        return strippedString;
    }

    /**
     * getter for overallAvyDanger String
     *
     * @return overallAvyDanger String which represents the overall danger for the day, ranging from None to Extreme
     */
    public String getavy_danger() {
        return overall_avy_danger;
    }

    /**
     * getter for bottomLine string
     *
     * @return the bottomLine, which is a string that represents the "Bottom Line" statement on the Forecast, which
     * is made by the Utah Avalanche Center and gives a bottom line about avalanche danger for the day
     */
    public String getbottom_line() {
        return bottom_line;
    }

    /**
     * getter for dateIssued string
     *
     * @return the dateIssued string, which is exactly what it sounds like
     */
    public String getdate_issued() {
        return date_issued;
    }

    /**
     * getter for passedRegion
     *
     * @return the region string passed to make this Forecast object, a more pretty and suitable version can
     * be accessed with the getRegion method, which returns the one found in the Json endpoint
     */
    public String getpassed_region() {
        return passed_region;
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
    public int[] getmain_rose_array() {
        return mainRose;
    }

    //The following methods all return their respective AvalancheProblem object
    public AvalancheProblem getavalanche_problem_1() {
        return avy_problem_1;
    }

    public AvalancheProblem getavalanche_problem_2() {
        return avy_problem_2;
    }

    public AvalancheProblem getavalanche_problem_3() {
        return avy_problem_3;
    }
}
