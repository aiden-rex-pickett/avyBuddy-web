package com.aidenPersonal.avyBuddy.controllers;

import com.aidenPersonal.avyBuddy.RouteFiles.Route;
import com.aidenPersonal.avyBuddy.RouteFiles.RouteDatabase;
import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;
import com.aidenPersonal.avyBuddy.uacData.Forecast;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
     * @param svgWidth width of the svg image for the route
     * @param region region of the routes to be returned
     * @return String of JSON object, where each route is in its own object named "1", then "2", etc. up to "{@code numRoutes}"
     */
    @CrossOrigin
    @GetMapping("/getRouteListRecency")
    public String getRouteList(@RequestParam int svgWidth, @RequestParam String region) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode routesNode = mapper.createArrayNode();

        List<Route> routes = RouteDatabase.getRoutesOrderedByRecency(region);

        for (Route route : routes) {
            routesNode.add(makeRouteNode(route, mapper, svgWidth));
        }

        return routesNode.toString();
    }

    /**
     * This controller returns all the routes in the database for a given region, sorted by the forecast data
     */
    @CrossOrigin
    @GetMapping("/getRouteListForecast")
    public String getRouteListForecast(@RequestParam int svgWidth, @RequestParam String region) {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode routesNode = mapper.createArrayNode();

        List<Route> routes = RouteDatabase.getRoutesOrderedByForecast(region);

        for (Route route : routes) {
            routesNode.add(makeRouteNode(route, mapper, svgWidth));
        }

        return routesNode.toString();
    }

    private static class RouteDTO {
        Optional<String> region;
        Optional<boolean[]> routePositions;
        Optional<String> description;

        RouteDTO (String region, int routePositions, String description) {
            this.region = Optional.ofNullable(region);

            if (routePositions == 0) {
                this.routePositions = Optional.empty();
            } else {
                routePositions = routePositions | 16777216;
                boolean[] routePositionsArray = new boolean[24];
                for (int i = 0; i < routePositionsArray.length; i++) {
                    routePositionsArray[i] = ((1 << routePositionsArray.length - i - 1) & routePositions) != 0;
                }
                this.routePositions = Optional.of(routePositionsArray);
            }

            this.description = Optional.ofNullable(description);
        }
    }

    @CrossOrigin
    @PatchMapping("/editRoute/{routeName}")
    public ResponseEntity<?> editRoute(@PathVariable String routeName, @RequestBody RouteDTO route) {
        if (route.routePositions.isPresent() && route.routePositions.get().length != 24)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (route.region.isPresent() && !Arrays.asList(Forecast.validRegions).contains(route.region.get()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        try {
            RouteDatabase.editRoute(routeName, route.region.orElse(null), route.routePositions.orElse(null), route.description.orElse(null));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * This helper method makes an {@code ObjectNode} that represents the route that is passed to it.
     *
     * @param route The route to be represented
     * @param mapper The {@code ObjectMapper} to be used to create the {@code ObjectNode}
     * @param svgWidth The width of the svg that shows the route positions on the frontend
     * @return The {@code ObjectNode} that represents the passed in route.
     */
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
        routeNode.put("dateCreated", route.getDateCreated());
        routeNode.put("description", route.getDescription());

        return routeNode;
    }
}
