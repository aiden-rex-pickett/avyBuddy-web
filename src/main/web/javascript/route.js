//Handles interaction with the backend as it pertains to the routes page

//Adds all the event listeners
const addRouteButton = document.getElementById("addRoute");
addRouteButton.addEventListener("click", addRoute);

const loadRoutesButton = document.getElementById("loadRoutes");
loadRoutesButton.addEventListener("click", loadRoutes);

const routeListArea = document.getElementById('routeList');

class Route {

}

function addRoute() {
    console.log("route added");
}

function loadRoutes() {
    

    console.log("routes loaded")
}

function createChildElement(routeData) {

}