package com.aidenPersonal.avyBuddy.uacData;

import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;

/**
 * This class represents an avalanche problem, and includes the necessary information for that
 *
 * @author Aiden Pickett
 * @version 02/27/25
 */
public class AvalancheProblem {

    private final int[] dangerArray;
    private final String problemTitle;
    private final String problemDescription;

    /**
     * Initalizes AvalancheProblem object
     *
     * @param dangerArray 24 length int array to represent rose danger
     * @param problemTitle title of the problem, or main for main rose
     * @param problemDescription problem description, or bottom line for main rose
     */
    public AvalancheProblem(int[] dangerArray, String problemTitle, String problemDescription) {
        this.dangerArray = dangerArray;
        this.problemTitle = problemTitle;
        this.problemDescription = problemDescription;
    }

    /**
     * This method gets a svg object of the specified width based on the data of this AvalancheProblem object
     *
     * @return string according to svg standard representing the above
     */
    public String getSvgOfRose(int width) {
        return SvgRoseGenerator.generateRose(width, dangerArray);
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public int[] getDangerArray() {
        return dangerArray;
    }

}
