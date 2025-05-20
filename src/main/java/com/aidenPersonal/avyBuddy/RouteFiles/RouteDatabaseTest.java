package com.aidenPersonal.avyBuddy.RouteFiles;

import java.util.List;

public class RouteDatabaseTest {

    public static void main(String[] args) {
        List<Route> routes = RouteDatabase.getRoutesOrderedByRecency(1000);
        for (Route route : routes) {
            System.out.println(route + "\n");
        }
    }

}
