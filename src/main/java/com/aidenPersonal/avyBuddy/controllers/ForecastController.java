package com.aidenPersonal.avyBuddy.controllers;

import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;
import com.aidenPersonal.avyBuddy.uacData.AvalancheProblem;
import com.aidenPersonal.avyBuddy.uacData.Forecast;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * This class is a rest controller that sends data from the UAC api to
 * the frontend, including forecast data and a svg of the avalanche rose
 */
@RestController
public class ForecastController {
    /**
     * This get mapping returns a JSON object representing the forecase
     *
     * @param region region to get forecast of
     * @param svgWidth width of the svg of the roses that you want
     * @return string of JSON object
     */
    @CrossOrigin
    @GetMapping("/forecast")
    public String forecast(@RequestParam String region, @RequestParam int svgWidth) {

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode forecastNode;

        if (svgWidth < 1) {
            throw new IllegalArgumentException("svgWidth must be greater than 0");
        }

        Forecast forecast;

        try {
            forecast = new Forecast(region);
            forecastNode = mapper.valueToTree(forecast);
        } catch (IOException e) {
            try {
                return mapper.writeValueAsString(new Forecast());
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }

        forecastNode.put("main_rose_svg", SvgRoseGenerator.generateRose(svgWidth, forecast.getmain_rose_array()));
        AvalancheProblem avalanche_problem_1;
        AvalancheProblem avalanche_problem_2;
        AvalancheProblem avalanche_problem_3;
        if (forecast.getavalanche_problem_1() != null) {
            avalanche_problem_1 = forecast.getavalanche_problem_1();
            ObjectNode avyProblem1Node = mapper.valueToTree(avalanche_problem_1);
            avyProblem1Node.put("danger_rose_svg", avalanche_problem_1.getSvgOfRose(svgWidth));
            forecastNode.set("avalanche_problem_1", avyProblem1Node);
        }
        if (forecast.getavalanche_problem_2() != null) {
            avalanche_problem_2 = forecast.getavalanche_problem_2();
            ObjectNode avyProblem2Node = mapper.valueToTree(avalanche_problem_2);
            avyProblem2Node.put("danger_rose_svg", avalanche_problem_2.getSvgOfRose(svgWidth));
            forecastNode.set("avalanche_problem_2", avyProblem2Node);
        }
        if (forecast.getavalanche_problem_3() != null) {
            avalanche_problem_3 = forecast.getavalanche_problem_3();
            ObjectNode avyProblem3Node = mapper.valueToTree(avalanche_problem_3);
            avyProblem3Node.put("danger_rose_svg", avalanche_problem_3.getSvgOfRose(svgWidth));
            forecastNode.set("avalanche_problem_3", avyProblem3Node);
        }

        return forecastNode.toString();
    }
}
