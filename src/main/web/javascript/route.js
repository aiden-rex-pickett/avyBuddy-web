//Handles interaction with the backend as it pertains to the routes page
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//Adds all the event listeners
var addRouteButton = document.getElementById("addRoute");
addRouteButton.addEventListener("click", addRoute);
var sortByForecastButton = document.getElementById("searchRoutes");
sortByForecastButton.addEventListener("click", loadSortedRoutes);
var buttonArea = document.getElementById('routeButtonArea');
var routesTitleArea = document.getElementById('routeHeaderArea');
var currentRegionDiv = document.getElementById("regionButton");
var currentRegionTitle = document.getElementById("regionTitle");
var regionSelectorDiv = document.getElementById("regionTitleWrapper");
var regionList = document.getElementById("regionList");
var regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
var lastSortingType;
var lastSortingRegion;
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
            loadTimeOrdredRoutes(region);
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
function getRouteListFromEndpoint(apiEndpoint, searchParams) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiEndpoint.search = searchParams.toString();
                    return [4 /*yield*/, fetch(apiEndpoint).then(function (response) { return response.json(); }).then(function (data) {
                            var routeList = new Array(data.length);
                            for (var i = 0; i < data.length; i++) {
                                var currentData = data[i];
                                routeList[i] = new Route(currentData["name"], currentData["region"], currentData["positions"], currentData["positionsSvg"], currentData["dateCreated"], currentData["description"]);
                            }
                            return routeList;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//Endpoint info
//For running off of local server
// const apiEndpointSort = "http://localhost:8080/apis/getRouteListForecast"
//For running from IDE
var apiEndpointSort = "http://localhost:5501/getRouteListForecast";
var queryParamsSort = {
    svgWidth: "250",
};
function loadSortedRoutes(String) {
    clearRouteArea();
    var region = currentRegionTitle.textContent;
    if (region == "Salt Lake") {
        queryParamsSort['region'] = 'salt-lake';
    }
    else {
        queryParamsSort['region'] = region.toLowerCase();
    }
    getRouteListFromEndpoint(new URL(apiEndpointSort), new URLSearchParams(queryParamsSort)).then(function (routeList) {
        routeList.forEach(function (route) {
            injectRouteIntoDOM(route);
        });
    });
    lastSortingType = loadSortedRoutes;
    lastSortingRegion = region;
}
//Endpoint info
//For running off of local server
// const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
//For running from IDE
var apiEndpoint = "http://localhost:5501/getRouteListRecency";
var queryParams = {
    svgWidth: "250",
};
function loadTimeOrdredRoutes(region) {
    if (region == "Salt Lake") {
        queryParams['region'] = 'salt-lake';
    }
    else {
        queryParams['region'] = region.toLowerCase();
    }
    getRouteListFromEndpoint(new URL(apiEndpoint), new URLSearchParams(queryParams)).then(function (routeList) {
        routeList.forEach(function (route) {
            injectRouteIntoDOM(route);
        });
    });
    lastSortingType = loadTimeOrdredRoutes;
    lastSortingRegion = region;
}
function injectRouteIntoDOM(route) {
    //creates the container for the route object
    var routeDiv = document.createElement('div');
    routeDiv.classList.add('routeContainer');
    routeDiv.addEventListener("click", function () {
        clearRoutePage(route);
    });
    var informationDiv = document.createElement('div');
    informationDiv.classList.add('routeInformationContainer');
    var routeInformationContainers = createRouteInformationContainers();
    function createRouteInformationContainers() {
        var nameDiv = document.createElement('div');
        var dateDiv = document.createElement('div');
        var descriptionDiv = document.createElement('div');
        var regionDiv = document.createElement('div');
        var dateText = document.createElement('p');
        var descriptionText = document.createElement('h2');
        var regionText = document.createElement('p');
        var nameText = document.createElement('h1');
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
function clearRoutePage(route) {
    buttonArea.style.display = 'none';
    routesTitleArea.style.display = 'none';
    clearRouteArea();
    buildRoutePage(route);
}
function buildRoutePage(route) {
    var routePageDiv = document.getElementById("routePageContainer");
    routePageDiv.classList.remove("routePageContainerClosed");
    var headerField = document.getElementById("routeHeader");
    var dateField = document.getElementById("dateCreated");
    var regionField = document.getElementById("region");
    var descriptionField = document.getElementById("routeDescription");
    var svgContainer = document.getElementById("routePageSvgContainer");
    headerField.textContent = route.name;
    dateField.textContent = "Created on " + route.dateCreated;
    regionField.textContent = "For the " + route.region + " region";
    descriptionField.textContent = route.description;
    svgContainer.innerHTML = route.positionsSVG;
    var backButton = document.getElementById("exitButton");
    backButton.addEventListener("click", function () {
        routePageDiv.classList.add("routePageContainerClosed");
        buttonArea.style.display = "";
        routesTitleArea.style.display = "";
        if (lastSortingType == loadSortedRoutes) {
            lastSortingType();
        }
        else {
            lastSortingType(lastSortingRegion);
        }
    });
}
loadTimeOrdredRoutes("salt-lake");
setupRegionSelector();
//# sourceMappingURL=route.js.map