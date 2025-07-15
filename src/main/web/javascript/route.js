//Handles interaction with the backend as it pertains to the routes page
//Adds all the event listeners
var addRouteButton = document.getElementById("addRoute");
addRouteButton.addEventListener("click", addRoute);
var sortByForecastButton = document.getElementById("searchRoutes");
sortByForecastButton.addEventListener("click", loadRoutes);
var currentRegionDiv = document.getElementById("regionButton");
var currentRegionTitle = document.getElementById("regionTitle");
var regionSelectorDiv = document.getElementById("regionTitleWrapper");
var regionList = document.getElementById("regionList");
var regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
setupRegionSelector();
function setupRegionSelector() {
    currentRegionDiv.addEventListener("mouseenter", function () {
        currentRegionDiv.style.backgroundColor = "#030f21";
        currentRegionDiv.style.color = "#bbd2e9";
        toggleRegionPanel();
    });
    currentRegionDiv.addEventListener("mouseleave", function () {
        currentRegionDiv.style.backgroundColor = "rgb(117, 186, 223)";
        currentRegionDiv.style.color = "#030f21";
        toggleRegionPanel();
    });
    regions.forEach(function (region) {
        var regionText = document.createElement('p');
        regionText.textContent = region;
        regionText.addEventListener('click', function () {
            clearRouteArea();
            currentRegionTitle.textContent = region;
            parseRoutes(region);
        });
        regionText.classList.add('regionOption');
        regionList.appendChild(regionText);
    });
}
function clearRouteArea() {
    while (routeListArea.firstChild) {
        routeListArea.removeChild(routeListArea.firstChild);
    }
}
function toggleRegionPanel() {
    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null;
        currentRegionDiv.style.maxHeight = "100";
    }
    else {
        regionSelectorDiv.style.maxHeight = "500";
        currentRegionDiv.style.maxHeight = "600";
    }
}
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
    console.log("add");
}
//Endpoint info
//For running off of local server
// const apiEndpointSort = "http://localhost:8080/apis/getRouteListForecast"
//For running from IDE
var apiEndpointSort = "http://localhost:5501/getRouteListForecast";
function loadRoutes() {
    clearRouteArea();
    var region = currentRegionTitle.textContent;
    if (region == "Salt Lake") {
        region = "salt-lake";
    }
    else {
        region = region.toLowerCase();
    }
    getRoutesByRecency(apiEndpointSort, { svgWidth: 250, region: region }).then(function (routesList) {
        routesList.forEach(function (route) {
            injectRouteIntoDOM(route);
        });
    });
}
//Endpoint info
//For running off of local server
// const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
//For running from IDE
var apiEndpoint = "http://localhost:5501/getRouteListRecency";
var queryParams = {
    svgWidth: 250,
    region: 'logan'
};
function parseRoutes(region) {
    if (region == "Salt Lake") {
        queryParams['region'] = 'salt-lake';
    }
    else {
        queryParams['region'] = region.toLowerCase();
    }
    getRoutesByRecency(apiEndpoint, queryParams).then(function (routesList) {
        routesList.forEach(function (route) {
            injectRouteIntoDOM(route);
        });
    });
}
function injectRouteIntoDOM(route) {
    //creates the container for the route object
    var routeDiv = document.createElement('div');
    routeDiv.classList.add('routeContainer');
    routeDiv.addEventListener("click", function () {
        createRoutePage(route);
    });
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
    svgContainer.style.width = "fit-content;";
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
function createRoutePage(route) {
    var buttonArea = document.getElementById('routeButtonArea');
    var routesTitleArea = document.getElementById('routeHeaderArea');
    clearRouteArea();
    buttonArea.style.display = 'none';
    routesTitleArea.style.display = 'none';
    setTimeout(function () {
        routesTitleArea.style.display = '';
        buttonArea.style.display = '';
        parseRoutes('salt-lake');
    }, 2000);
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
            routesList[i] = new Route(currentRoute.name, currentRoute.region, currentRoute.positions, currentRoute.positionsSvg, currentRoute.dateCreated, currentRoute.description);
        }
        return routesList;
    });
}
parseRoutes("salt-lake");
//# sourceMappingURL=route.js.map