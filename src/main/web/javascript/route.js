//Handles interaction with the backend as it pertains to the routes page
//Adds all the event listeners
var addRouteButton = document.getElementById("addRoute");
addRouteButton.addEventListener("click", addRoute);
var routeListArea = document.getElementById('routeList');
var Route = /** @class */ (function () {
    function Route(name, region, positions, positionsSVG, dateCreated, description) {
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
    return Route;
}());
function addRoute() {
}
function loadRoutes() {
    parseRoutes();
}
//Endpoint info
//For running off of local server
//const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
//For running from IDE
var apiEndpoint = "http://localhost:5501/getRouteListRecency";
var queryParams = {
    numRoutes: 10,
    numRoutesLoaded: 0,
    svgWidth: 250
};
function parseRoutes() {
    getRoutesByRecency(apiEndpoint, queryParams).then(function (routesList) {
        routesList.forEach(function (route) {
            injectRouteIntoDOM(route);
            queryParams.numRoutesLoaded++;
        });
    });
}
function injectRouteIntoDOM(route) {
    //creates the container for the route object
    var routeDiv = document.createElement('div');
    routeDiv.classList.add('routeContainer');
    var informationDiv = document.createElement('div');
    informationDiv.classList.add('routeInformationContainer');
    var routeInformationContainers = createRouteInformationContainers();
    function createRouteInformationContainers() {
        var nameDiv = document.createElement('div');
        var dateDiv = document.createElement('div');
        var descriptionDiv = document.createElement('div');
        var regionDiv = document.createElement('div');
        var nameText = document.createElement('h1');
        var dateText = document.createElement('p');
        var descriptionText = document.createElement('h2');
        var regionText = document.createElement('p');
        nameText.textContent = route.name;
        dateText.textContent = 'created on ' + route.dateCreated;
        descriptionText.textContent = route.description;
        regionText.textContent = 'for the ' + route.region + ' region';
        nameDiv.appendChild(nameText);
        dateDiv.appendChild(dateText);
        descriptionDiv.appendChild(descriptionText);
        regionDiv.appendChild(regionText);
        return [nameDiv, descriptionDiv, dateDiv, regionDiv];
    }
    routeInformationContainers.forEach(function (container) {
        container.classList.add('routeInformationTextContainer');
        informationDiv.appendChild(container);
    });
    routeDiv.appendChild(informationDiv);
    //creates svg container div
    var svgContainer = document.createElement('div');
    svgContainer.style = "width: fit-content;";
    var svg = document.createElement('svg');
    svg.innerHTML = route.positionsSVG;
    svgContainer.appendChild(svg);
    //adds svg container to route container
    routeDiv.appendChild(svgContainer);
    //adds route container to the overall list area (hard-coded into dom in html)
    routeListArea.appendChild(routeDiv);
    //adds dividing line to overall list area
    var listDividingLine = document.createElement('hr');
    listDividingLine.classList.add("dividingLine");
    routeListArea.appendChild(listDividingLine);
}
function getRoutesByRecency(apiEndpoint, queryParams) {
    var requestURL = new URL(apiEndpoint);
    var requestParams = new URLSearchParams(queryParams);
    requestURL.search = requestParams.toString();
    return fetch(requestURL)
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var routesList = [];
        for (var i = 0; i < data.length; i++) {
            var currentRoute = data[i];
            var route = new Route(currentRoute.name, currentRoute.region, currentRoute.positions, currentRoute.positionsSvg, currentRoute.dateCreated, currentRoute.description);
            routesList[i] = route;
        }
        return routesList;
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (element) {
            if (element.isIntersecting) {
                loadRoutes();
            }
        });
    });
    observer.observe(document.getElementById("footer"));
});
//# sourceMappingURL=route.js.map