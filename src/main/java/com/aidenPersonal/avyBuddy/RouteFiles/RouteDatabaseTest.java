package com.aidenPersonal.avyBuddy.RouteFiles;

import java.util.Arrays;

public class RouteDatabaseTest {

    public static void main(String[] args) {
        Route test1 = RouteDatabase.getRoute("test0");
        Route test2 = RouteDatabase.getRoute("test1");
        Route test3 = RouteDatabase.getRoute("test2");
        Route test4 = RouteDatabase.getRoute("test3");
        Route[] routes = new Route[] {test1, test2, test3, test4};

        Arrays.sort(routes, new RouteComparator("salt-lake"));

        System.out.println(Arrays.toString(routes));
    }

}
