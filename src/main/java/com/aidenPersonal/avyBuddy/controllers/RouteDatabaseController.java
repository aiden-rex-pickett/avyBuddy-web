package com.aidenPersonal.avyBuddy.controllers;

import com.aidenPersonal.avyBuddy.RouteFiles.Route;
import com.aidenPersonal.avyBuddy.RouteFiles.RouteDatabase;
import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * This class provides endpoints for the frontend to interact with the database, including fetching specific data, lists of
 * data, as well as creating and deleting data
 *
 * @author Aiden Pickett
 * @version 5/19/25
 */
@RestController
public class RouteDatabaseController {

    /**
     * This controller returns the top-{@code numRoutes} most recent routes in the database by creation
     *
     * @param numRoutes the number of routes to load and return
     * @return String of JSON object, where each route is in its own object named "1", then "2", etc. up to "{@code numRoutes}"
     */
    @CrossOrigin
    @GetMapping("/getRouteListRecency")
    public String getRouteList(@RequestParam int numRoutes, @RequestParam int svgWidth) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode routesNode = mapper.createArrayNode();

        if (numRoutes < 1) {
            throw new IllegalArgumentException("numRoutes must be greater than 0");
        }

        List<Route> routes = RouteDatabase.getRoutesOrderedByRecency(numRoutes);

        for (Route route : routes) {
            routesNode.add(makeRouteNode(route, mapper, svgWidth));
        }

        return routesNode.toString();
    }

    private static ObjectNode makeRouteNode(Route route, ObjectMapper mapper, int svgWidth) {
        ObjectNode routeNode = mapper.createObjectNode();
        routeNode.put("name", route.getName());
        routeNode.put("region", route.getRegion());
        boolean[] routePositions = route.getRoutePositions();
        ArrayNode routePositionsNode = mapper.createArrayNode();
        for (int i = 0; i < 24; i++) {
            routePositionsNode.add(routePositions[i]);
        }
        routeNode.put("positions", routePositionsNode);
        routeNode.put("positionsSvg", SvgRoseGenerator.generateRose(svgWidth, route.getRoutePositions()));
        System.out.println(SvgRoseGenerator.generateRose(svgWidth, route.getRoutePositions()));
        routeNode.put("dateCreated", route.getDateCreated());

        return routeNode;
    }
}
