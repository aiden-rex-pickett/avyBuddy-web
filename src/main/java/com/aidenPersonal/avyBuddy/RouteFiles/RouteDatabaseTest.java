package com.aidenPersonal.avyBuddy.RouteFiles;

import java.util.List;

public class RouteDatabaseTest {

    public static void main(String[] args) {
        Route route = new Route("salt-lake", "Baldy Chutes", 0, 0, 1);
        RouteDatabase.addRoute(route);
    }

}
