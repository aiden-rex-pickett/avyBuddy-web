// TODO: More to be done now that inital crap is cleaned up. I want to make this stateless
// it might be a bit slower but we should.
// HTML:
//   - Make a simple 404 page for nginx to serve when any route page that is not well defined in the .map file
// JS:
//   1. Read the end of the url to see which route to search for
//   2. fetch the endpoint with that name
//   3. Buttons for the specific route will not just redirect to the other pages
//   This way the whole thing is stateless
// I will finally stop prematurely optimizing by not pulling all the routes, not doing xyz, whatever.
// All that is great but I just gotta finish this project bruh its been too long
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
var addRouteButton = document.getElementById("addRoute");
var buttonArea = document.getElementById('routeButtonArea');
var routesTitleArea = document.getElementById('routeHeaderArea');
var currentRegion = getRegionFromUrl();
var regionDiv = document.getElementById("regionButton");
var routeContainer = document.querySelector("#routeContainer");
var regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
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
setupRegionSelector();
// Note: we can assume the url contains a valid region because if it did not
// the nginx server would have redirected to the error page 
function getRegionFromUrl() {
    var urlRegion = window.location.pathname.split("/").pop();
    urlRegion = urlRegion.trim();
    urlRegion = urlRegion.split("-").join(" ");
    urlRegion = urlRegion.charAt(0).toUpperCase() + urlRegion.substring(1).toLowerCase();
    return urlRegion;
}
function getRouteListFromEndpoint(apiEndpoint, searchParams) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiEndpoint.search = searchParams.toString();
                    return [4 /*yield*/, fetch(apiEndpoint).then(function (response) {
                            if (!response.ok) {
                                return response.status;
                            }
                            return response.json().then(function (serverArray) {
                                var routeList = new Array(serverArray.length);
                                for (var i = 0; i < routeList.length; i++) {
                                    var currRoute = serverArray[i];
                                    routeList[i] = new Route(currRoute["name"], currRoute["region"], currRoute["positions"], currRoute["positionsSvg"], currRoute["dateCreated"], currRoute["description"]);
                                }
                                return routeList;
                            })
                                .catch(function () { return 1; });
                        })];
                case 1:
                    result = _a.sent();
                    if (Array.isArray(result)) {
                        return [2 /*return*/, result];
                    }
                    else {
                        console.error(result);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function loadSortedRoutes(region) {
    var apiEndpoint = "/apis/getRouteListForecast";
    var queryParamsSort = {
        svgWidth: "250",
    };
    if (region == "Salt Lake") {
        queryParamsSort['region'] = 'salt-lake';
    }
    else {
        queryParamsSort['region'] = region.toLowerCase();
    }
    getRouteListFromEndpoint(new URL(apiEndpoint, window.location.origin), new URLSearchParams(queryParamsSort)).then(function (routeList) {
        routeList.forEach(function (route) {
            routeContainer.appendChild(makeRouteContainer(route));
            routeContainer.appendChild(makeDividingLine());
        });
    });
}
function loadTimeOrdredRoutes(region) {
    var apiEndpoint = "/apis/getRouteListRecency";
    var queryParams = {
        svgWidth: "250",
    };
    if (region == "Salt Lake") {
        queryParams['region'] = 'salt-lake';
    }
    else {
        queryParams['region'] = region.toLowerCase();
    }
    getRouteListFromEndpoint(new URL(apiEndpoint, window.location.origin), new URLSearchParams(queryParams)).then(function (routeList) {
        routeList.forEach(function (route) {
            routeContainer.appendChild(makeRouteContainer(route));
            routeContainer.appendChild(makeDividingLine());
        });
    });
}
// Creates and returns a html element which holds all the route information for a single route
function makeRouteContainer(route) {
    // Outer container
    var routeContainer = document.createElement('section');
    routeContainer.classList.add('routeInformationSection');
    // Text contianer to go in outer container
    var textContainer = document.createElement('div');
    // Title and descriton to go in text container
    var title = document.createElement('h1');
    title.textContent = route.name;
    var description = document.createElement('h4');
    description.textContent = route.description;
    textContainer.appendChild(title);
    textContainer.appendChild(description);
    // Date and region
    var date = document.createElement('p');
    date.textContent = route.dateCreated;
    var region = document.createElement('p');
    region.textContent = route.region;
    textContainer.appendChild(date);
    textContainer.appendChild(region);
    // Image to go in outer container
    var image = document.createElement('svg');
    image.classList.add('routeRoseSvg');
    image.innerHTML = route.positionsSVG;
    routeContainer.appendChild(textContainer);
    routeContainer.appendChild(image);
    return routeContainer;
}
// Creates and returns a simple dividing line to divide route sections
function makeDividingLine() {
    var divider = document.createElement('hr');
    divider.classList.add('dividingLine');
    return divider;
}
// These functions simply sets up some nice animations for the top panel
function setupRegionSelector() {
    var regionList = document.getElementById("regionList");
    var regionTitle = document.getElementById("regionTitle");
    if (regions.includes(currentRegion)) {
        regionTitle.textContent = currentRegion;
    }
    else {
        regionTitle.textContent = "Salt Lake";
    }
    regionDiv.addEventListener("mouseenter", function () {
        regionDiv.style.backgroundColor = "#030f21";
        regionDiv.style.color = "#bbd2e9";
        toggleRegionPanel();
    });
    regionDiv.addEventListener("mouseleave", function () {
        regionDiv.style.backgroundColor = "rgb(117, 186, 223)";
        regionDiv.style.color = "#030f21";
        toggleRegionPanel();
    });
    regions.forEach(function (region) {
        var regionLink = document.createElement('a');
        regionLink.textContent = region;
        region = region.split(" ").join("-"); // Change here to dashes for link
        regionLink.href = "/routes/" + region;
        regionLink.classList.add('regionOption');
        regionList.appendChild(regionLink);
    });
}
function toggleRegionPanel() {
    var regionSelectorDiv = document.getElementById("regionTitleWrapper");
    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null;
        regionDiv.style.maxHeight = "100";
    }
    else {
        regionSelectorDiv.style.maxHeight = "500";
        regionDiv.style.maxHeight = "600";
    }
}
