package com.aidenPersonal.avyBuddy.imageHandling;

import org.jfree.graphics2d.svg.SVGGraphics2D;

import java.awt.*;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;

/**
 * This class allows for the creations of avalanche rose images that are .svg files for sending to the
 * frontend.
 *
 * @author Aiden Pickett
 * @Version 2/21/25
 */
public class svgRoseGenerator {

    public static String generateTestImage(int width, int[] roseValues) {
        if(roseValues.length != 24) {
            throw new IllegalArgumentException("The number of rose values must be 24");
        }
        if(width < 50) {
            throw new IllegalArgumentException("The minimum width is 50");
        }
        SVGGraphics2D svgGenerator = new SVGGraphics2D(width, width);
        drawRoseOutline(svgGenerator, width);

        return svgGenerator.getSVGElement();
    }

    private static void drawRoseOutline(SVGGraphics2D svgGenerator, int width) {
        //Sets uniform stroke width
        svgGenerator.setStroke(new BasicStroke(width/50));

        //Draws elevation bands
        svgGenerator.draw(new Ellipse2D.Double(5, 5, width - 10, width - 10));

        //calculates the spacing for the circles
        double spacing = Math.cos(45 * Math.PI / 180)*(Math.sqrt(Math.pow((double) (width - 10)/2, 2) + Math.pow(((double) (width - 10)/2), 2))/3);

        svgGenerator.draw(new Ellipse2D.Double(5 + spacing, 5 + spacing, (width - 10)*2/3, (width - 10)*2/3));
        svgGenerator.draw(new Ellipse2D.Double(5 + spacing*2, 5 + spacing*2, (width - 10)/3, (width - 10)/3));

        //Draws lines that show aspect
        for(double i = 0.0; i < 4; i ++) {
            svgGenerator.draw(new Line2D.Double((width/2) + Math.cos((22.5 + 45*i) * Math.PI / 180) * (width - 10)/2,
                    (width/2) + Math.sin((22.5 + 45*i) * Math.PI / 180) * (width - 10)/2,
                    (width/2) - Math.cos((22.5 + 45*i) * Math.PI / 180) * (width - 10)/2,
                    (width/2) - Math.sin((22.5 + 45*i) * Math.PI / 180) * (width - 10)/2));
        }

    }

    public static void main(String[] args) {
        System.out.println(generateTestImage(150, new int[24]));
    }

}
