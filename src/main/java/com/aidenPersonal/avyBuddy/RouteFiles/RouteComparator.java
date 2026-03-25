package com.aidenPersonal.avyBuddy.RouteFiles;

import com.aidenPersonal.avyBuddy.uacData.Forecast;

import java.io.IOException;
import java.util.Comparator;

/**
 * Compares route objects based on the given forecast for the day.
 *
 * @author Aiden Pickett
 * @version 07/02/2025
 */
public class RouteComparator implements Comparator<Route> {

    int[] currentDanger;

    /**
     * Constructor that takes a region to make a Forecast to sort the Routes by
     *
     * @param region The region to get forecast data to sort the routes by
     */
    RouteComparator(String region) {
        Forecast forecast = null;
        try {
            forecast = new Forecast(region);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        currentDanger = forecast.getmain_rose_array();
    }

    @Override
    public int compare(Route o1, Route o2) {
        boolean[] o1Positions = o1.getRoutePositions();
        boolean[] o2Positions = o2.getRoutePositions();

        double o1DangerAverage = 0.0;
        double o1DangerPositions = 0.0;
        double o2DangerAverage = 0.0;
        double o2DangerPositions = 0.0;

        for (int i = 0; i < o1Positions.length; i++) {
            if (o1Positions[i]) {
                o1DangerPositions++;
                o1DangerAverage += currentDanger[i];
            }
            if (o2Positions[i]) {
                o2DangerPositions++;
                o2DangerAverage += currentDanger[i];
            }
        }

        o1DangerAverage /= o1DangerPositions;
        o2DangerAverage /= o2DangerPositions;

        return Double.compare(o1DangerAverage, o2DangerAverage);
    }

}
