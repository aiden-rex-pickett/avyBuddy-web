package com.aidenPersonal.avyBuddy.controllers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aidenPersonal.avyBuddy.RouteFiles.Route;
import com.aidenPersonal.avyBuddy.RouteFiles.RouteDatabase;
import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;
import com.aidenPersonal.avyBuddy.uacData.Forecast;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * This class provides endpoints for the frontend to interact with the database,
 * including fetching specific data, lists of
 * data, as well as creating and deleting data
 *
 * @author Aiden Pickett
 * @version 5/19/25
 */
@RestController
public class RouteDatabaseController {

    /**
     * This controller returns the top-{@code numRoutes} most recent routes in the
     * database by creation
     *
     * @param svgWidth width of the svg image for the route
     * @param region   region of the routes to be returned
     * @return String of JSON object, where each route is in its own object named
     *         "1", then "2", etc. up to "{@code numRoutes}"
     */
    @GetMapping("/getRouteListRecency")
    public String getRouteList(@RequestParam final int svgWidth, @RequestParam final String region) {
        final ObjectMapper mapper = new ObjectMapper();
        final ArrayNode routesNode = mapper.createArrayNode();

        final List<Route> routes = RouteDatabase.getRoutesOrderedByRecency(region);

        for (final Route route : routes) {
            routesNode.add(makeRouteNode(route, mapper, svgWidth));
        }

        return routesNode.toString();
    }

    /**
     * This controller returns all the routes in the database for a given region,
     * sorted by the forecast data
     */
    @GetMapping("/getRouteListForecast")
    public String getRouteListForecast(@RequestParam final int svgWidth, @RequestParam final String region) {
        final ObjectMapper mapper = new ObjectMapper();
        final ArrayNode routesNode = mapper.createArrayNode();

        final List<Route> routes = RouteDatabase.getRoutesOrderedByForecast(region);

        for (final Route route : routes) {
            routesNode.add(makeRouteNode(route, mapper, svgWidth));
        }

        return routesNode.toString();
    }

    private static class RouteDTO {
        Optional<String> region;
        Optional<boolean[]> routePositions;
        Optional<String> description;
    }

    @GetMapping("/route/{routeName}")
    public String getRoute(@PathVariable final String routeName) {
        final ObjectMapper mapper = new ObjectMapper();
        try {
            final Route route = RouteDatabase.getRoute(routeName);
            return makeRouteNode(route, mapper, 500).toString();
        } catch (final NullPointerException e) {
            return "{\"Error\": \"There is no such route in the database\"}";
        }
    }

    @PatchMapping("/editRoute/{routeName}")
    public ResponseEntity<?> editRoute(@PathVariable final String routeName, @RequestBody final RouteDTO route) {
        if (route.routePositions.isPresent() && route.routePositions.get().length != 24)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (route.region.isPresent() && !Arrays.asList(Forecast.validRegions).contains(route.region.get()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        try {
            RouteDatabase.editRoute(routeName, route.region.orElse(null), route.routePositions.orElse(null),
                    route.description.orElse(null));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (final RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    /**
     * This helper method makes an {@code ObjectNode} that represents the route that
     * is passed to it.
     *
     * @param route    The route to be represented
     * @param mapper   The {@code ObjectMapper} to be used to create the
     *                 {@code ObjectNode}
     * @param svgWidth The width of the svg that shows the route positions on the
     *                 frontend
     * @return The {@code ObjectNode} that represents the passed in route.
     */
    @SuppressWarnings("deprecation")
    private static ObjectNode makeRouteNode(final Route route, final ObjectMapper mapper, final int svgWidth) {
        final ObjectNode routeNode = mapper.createObjectNode();
        routeNode.put("name", route.getName());
        routeNode.put("region", route.getRegion());
        final boolean[] routePositions = route.getRoutePositions();
        final ArrayNode routePositionsNode = mapper.createArrayNode();
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
