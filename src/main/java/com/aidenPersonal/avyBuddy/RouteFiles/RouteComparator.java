package com.aidenPersonal.avyBuddy.RouteFiles;

import java.util.Comparator;

import com.aidenPersonal.avyBuddy.uacData.Forecast;

/**
 * Compares route objects based on the given forecast for the day.
 *
 * @author Aiden Pickett
 * @version 07/02/2025
 */
public class RouteComparator implements Comparator<com.aidenPersonal.avyBuddy.models.Route> {

    int[] currentDanger;

    /**
     * Constructor that takes a Forecast object to sort by
     *
     * @param forecast The forecast object for that region
     */
    public RouteComparator(Forecast forecast) {
        currentDanger = forecast.getmain_rose_array();
    }

    @Override
    public int compare(com.aidenPersonal.avyBuddy.models.Route o1, com.aidenPersonal.avyBuddy.models.Route o2) {
        boolean[] o1Positions = o1.getPositionsArray();
        boolean[] o2Positions = o2.getPositionsArray();

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
