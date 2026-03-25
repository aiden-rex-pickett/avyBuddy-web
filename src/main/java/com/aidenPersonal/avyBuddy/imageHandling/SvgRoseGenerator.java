package com.aidenPersonal.avyBuddy.imageHandling;

import org.jfree.graphics2d.svg.SVGGraphics2D;

import java.awt.*;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * This class allows for the creations of avalanche rose images that are .svg files for sending to the
 * frontend.
 *
 * @author Aiden Pickett
 * @version 2/21/25
 */
public class SvgRoseGenerator {

    //This hashmap is used for mapping the integer values that represent the dangers to
    //the colors that correspond to the dangers
    private static final HashMap<Integer, Color> dangerValuesToColorsMap = new HashMap<>(); static {
        dangerValuesToColorsMap.put(0, Color.WHITE);
        dangerValuesToColorsMap.put(1, Color.WHITE);
        dangerValuesToColorsMap.put(2, new Color(115, 180, 87));
        dangerValuesToColorsMap.put(3, new Color(115, 180, 87));
        dangerValuesToColorsMap.put(4, new Color(249, 240, 81));
        dangerValuesToColorsMap.put(5, new Color(249, 240, 81));
        dangerValuesToColorsMap.put(6, new Color(226, 152, 62));
        dangerValuesToColorsMap.put(7, new Color(226, 152, 62));
        dangerValuesToColorsMap.put(8, new Color(209, 59, 48));
        dangerValuesToColorsMap.put(9, Color.BLACK);
        dangerValuesToColorsMap.put(10, Color.BLACK);
        dangerValuesToColorsMap.put(14, new Color(192, 192, 192));
        dangerValuesToColorsMap.put(16, new Color(117, 186, 223));
    }

    /**
     * This method generates a rose with a given width. The reason that there is a 94 hardcoded
     * into the creation of the rose is because a rose of width 94 creates no sub-pixel disturbances
     * that would be noticeable when scaling the .svg.
     *
     * @param width desired with of the svg
     * @param roseValues A 24-length int array for the values of each of the aspects/elevations. This is
     *                   specified by the UAC API endpoint
     * @return A string which can be used as an SVG element in a html file
     */
    public static String generateRose(int width, int[] roseValues) {
        if(roseValues.length != 24) {
            throw new IllegalArgumentException("The number of rose values must be 24");
        }

        double scaleFactor = (double) width /94;
        //94 is picked so that the build-in scaling function can be used to get the right width
        //and scale off of a pixel-perfect model
        SVGGraphics2D svgGenerator = new SVGGraphics2D((int) (94 * scaleFactor), (int) (94 * scaleFactor));
        svgGenerator.scale(scaleFactor, scaleFactor);

        drawRoseColors(svgGenerator, roseValues);
        drawRoseOutline(svgGenerator);

        return svgGenerator.getSVGElement();
    }

    /**
     * This method generates a rose with a given width. The reason that there is a 94 hardcoded
     * into the creation of the rose is because a rose of width 94 creates no sub-pixel disturbances
     * that would be noticeable when scaling the .svg.
     *
     * @param width desired with of the svg
     * @param roseValues A 24-length boolean array for the values of each of the aspects/elevations. This is
     *                   specified by the Routes class
     * @return A string which can be used as an SVG element in a html file
     */
    public static String generateRose(int width, boolean[] roseValues) {
        if(roseValues.length != 24) {
            throw new IllegalArgumentException("The number of rose values must be 24");
        }

        double scaleFactor = (double) width /94;
        //94 is picked so that the build-in scaling function can be used to get the right width
        //and scale off of a pixel-perfect model
        SVGGraphics2D svgGenerator = new SVGGraphics2D((int) (94 * scaleFactor), (int) (94 * scaleFactor));
        svgGenerator.scale(scaleFactor, scaleFactor);

        int[] roseColors = new int[24];
        for(int i = 0; i < 24; i++) {
            if (roseValues[i]) {
                roseColors[i] = 16;
            }
        }

        drawRoseColors(svgGenerator, roseColors);
        drawRoseOutline(svgGenerator);

        return svgGenerator.getSVGElement();
    }

    /**
     * This method draws the Colors of the rose. This one is not imprecise, thank God.
     *
     * @param svgGenerator SVGGraphics2D object that the rose will be drawn with
     * @param roseValues A 24-length int array for the values of each of the aspects/elevations. This is
     *                   specified by the UAC API endpoint
     */
    private static void drawRoseColors(SVGGraphics2D svgGenerator, int[] roseValues) {
        //This is made so that the rose values passed don't have to be inverted.
        //Inverted here for drawing purposes, so we can draw last to first
        ArrayList<Integer> reversedList = new ArrayList<>();
        for(int i = roseValues.length - 1; i >= 0; i--) {
            reversedList.add(roseValues[i]);
        }

        for (int i = 0; i < 3; i++) {
            int x = 2 + 15 * i;
            int widthActual = 90 - 30 * i;
            for (int j = 0; j < 8; j++) {
                svgGenerator.setColor(dangerValuesToColorsMap.get(reversedList.get((i * 8) + j)));
                int beginAngle = (int) ((90 + 22.5) + 45 * j);
                int rotateAngle = 45;
                svgGenerator.fillArc(x, x, widthActual, widthActual, beginAngle, rotateAngle);
            }
        }
    }

    /**
     * This method draws the outline of the rose.
     *
     * @param svgGenerator SVGGraphics2D object that the rose will be drawn with
     */
    private static void drawRoseOutline(SVGGraphics2D svgGenerator) {
        //Sets uniform stroke width
        int strokeWidth = 1;
        svgGenerator.setStroke(new BasicStroke(strokeWidth));
        svgGenerator.setColor(Color.BLACK);

        for (int i = 0; i < 3; i++) {
            int x = 2 + 15 * i;
            int widthActual = 90 - 30 * i;
            for (int j = 0; j < 8; j++) {
                int beginAngle = (int) ((90 + 22.5) + 45 * j);
                int rotateAngle = 45;
                svgGenerator.drawArc(x, x, widthActual, widthActual, beginAngle, rotateAngle);
            }
        }

    }

}
