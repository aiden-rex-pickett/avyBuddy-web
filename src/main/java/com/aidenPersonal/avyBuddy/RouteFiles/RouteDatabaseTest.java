package com.aidenPersonal.avyBuddy.RouteFiles;

import com.aidenPersonal.avyBuddy.imageHandling.SvgRoseGenerator;

public class RouteDatabaseTest {

    public static void main(String[] args) {
        Route route = new Route("salt-lake", "test2", new boolean[] {true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false});
        RouteDatabase.addRoute(route);
        Route newRoute = RouteDatabase.getRoute("test2");
        System.out.println(route.equals(newRoute));
    }

}
