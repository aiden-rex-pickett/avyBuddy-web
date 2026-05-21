// HACK: This could possibly get out of sync with the map of valid regions in the nginx config
// maybe look into this and find some way to do the check of if we are on a valid page without
// this list, maybe by some huristic about the state of the dom to see the differences between 
// a valid and invalid page idk
const validRegions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
// Simple struct-like container for a single route object, for use in constructing the route sections
class Route {
    name;
    id;
    region;
    positions;
    positionsSVG;
    dateCreated;
    description;
    constructor(id, name, region, positions, positionsSVG, dateCreated, description) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
}
// The HTML element where the region for the page is displayed
const currentRegionDiv = document.getElementById("regionButton");
// The HTML element where the route sections will be injected into
const routeContainer = document.querySelector("#routeContainer");
// The region for the page
const region = getRegionFromUrl();
setupRegionSelector();
loadTimeOrdredRoutes(region);
setupOrderByForecastButton();
// Gets the region in the form that the endpoint would understand from the URL
//
// Note: we can assume the url contains a valid region because if it did not
// the nginx server would have redirected to the error page 
function getRegionFromUrl() {
    let urlRegion = window.location.pathname.split("/").pop();
    urlRegion = urlRegion.trim();
    urlRegion = urlRegion.split(" ").join("-");
    urlRegion = urlRegion.toLowerCase();
    return urlRegion;
}
// Adds the event listener to the order by forecast button to
// replace all the routes with the new ordered routes
function setupOrderByForecastButton() {
    const orderByForecastButton = document.getElementById("orderByForecast");
    if (orderByForecastButton != null) {
        orderByForecastButton.addEventListener("click", () => {
            routeContainer.replaceChildren();
            loadSortedRoutes(region);
        });
    }
}
// Loads and fills the route listing area with a list of routes ordered
// by how recently they were created
function loadTimeOrdredRoutes(region) {
    const apiEndpoint = "/apis/getRouteListRecency";
    const url = new URL(apiEndpoint, window.location.origin);
    url.searchParams.set("svgWidth", "250");
    url.searchParams.set("region", region);
    getRouteListFromEndpoint(url).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route));
            routeContainer.appendChild(makeDividingLine());
        });
    }).catch((statusCode) => {
        console.error(statusCode);
    });
}
// Loads and fills the route listing area with a list of routes ordered
// by how dangerous they would be based on the forecast of the day
function loadSortedRoutes(region) {
    const apiEndpoint = "/apis/getRouteListForecast";
    const url = new URL(apiEndpoint, window.location.origin);
    url.searchParams.set("svgWidth", "250");
    url.searchParams.set("region", region);
    getRouteListFromEndpoint(url).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route));
            routeContainer.appendChild(makeDividingLine());
        });
    }).catch((statusCode) => {
        console.error(statusCode);
    });
}
// Function that gets a list of Route objects from a given API endpoint
// the endpoint should be one that returns a list of routes in the expected form
function getRouteListFromEndpoint(apiEndpoint) {
    // TODO: Check if a bad result gets returned, if so return some sort of error promise so that it renders error?
    return new Promise((resolve, reject) => {
        fetch(apiEndpoint).then(async (response) => {
            if (response.status != 200) { // If not good data, reject promise with status code
                reject(response.status);
            }
            else {
                const data = await response.json();
                let routeList = new Array(data.length);
                for (let i = 0; i < routeList.length; i++) {
                    const currRoute = data[i];
                    routeList[i] = new Route(currRoute["id"], currRoute["name"], currRoute["region"], currRoute["positions"], currRoute["positionsSvg"], currRoute["dateCreated"], currRoute["description"]);
                }
                resolve(routeList); // If good data, fulfill with route list
            }
        }).catch(() => {
            reject(404);
        });
    });
}
// Creates and returns a html element which holds all 
// the route information for a single route
function makeRouteContainer(route) {
    // Outer container
    const routeContainer = document.createElement('section');
    routeContainer.classList.add('routeInformationSection');
    routeContainer.addEventListener("click", () => {
        window.location.href = "/route/" + route.id;
    });
    // Text contianer to go in outer container
    const textContainer = document.createElement('div');
    // Title and descriton to go in text container
    const title = document.createElement('h1');
    title.textContent = route.name;
    const description = document.createElement('h4');
    description.textContent = route.description;
    textContainer.appendChild(title);
    textContainer.appendChild(description);
    // Date and region
    const date = document.createElement('p');
    date.textContent = route.dateCreated;
    const routeRegion = document.createElement('p');
    routeRegion.textContent = route.region;
    textContainer.appendChild(date);
    textContainer.appendChild(routeRegion);
    // Image to go in outer container
    const image = document.createElement('svg');
    image.classList.add('routeRoseSvg');
    image.innerHTML = route.positionsSVG;
    routeContainer.appendChild(textContainer);
    routeContainer.appendChild(image);
    return routeContainer;
}
// Creates and returns a simple dividing line to divide route sections
function makeDividingLine() {
    const divider = document.createElement('hr');
    divider.classList.add('dividingLine');
    return divider;
}
// Sets up the animations for the region selector panel
function setupRegionSelector() {
    const regionList = document.getElementById("regionList");
    const regionTitle = document.getElementById("regionTitle");
    regionTitle.textContent = makePretty(region);
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
    validRegions.forEach(validRegion => {
        const regionLink = document.createElement('a');
        regionLink.textContent = validRegion;
        validRegion = validRegion.split(" ").join("-"); // Change here to dashes for link
        regionLink.href = "/routes/" + validRegion;
        regionLink.classList.add('regionOption');
        regionList.appendChild(regionLink);
    });
}
// Makes a region string that is in a form that the endpoint
// would understand into a nice Looking space separated string
// of capitalized words for the user to oodle at.
function makePretty(region) {
    let regionWords = region.trim().toLowerCase().split("-");
    for (let i = 0; i < regionWords.length; i++) {
        regionWords[i] = regionWords[i].charAt(0).toUpperCase() + regionWords[i].slice(1);
    }
    return regionWords.join(" ");
}
// Function for opening and closing the region selector 
// panel when teh user hovers their mouse over it
function toggleRegionPanel() {
    const regionSelectorDiv = document.getElementById("regionTitleWrapper");
    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null;
        currentRegionDiv.style.maxHeight = "100";
    }
    else {
        regionSelectorDiv.style.maxHeight = "500";
        currentRegionDiv.style.maxHeight = "600";
    }
}
