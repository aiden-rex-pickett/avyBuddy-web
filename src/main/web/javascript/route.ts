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

const addRouteButton: HTMLButtonElement = document.getElementById("addRoute") as HTMLButtonElement;


const buttonArea = document.getElementById('routeButtonArea');
const routesTitleArea = document.getElementById('routeHeaderArea');

const currentRegion = getRegionFromUrl();

const regionDiv: HTMLDivElement = document.getElementById("regionButton") as HTMLDivElement

const routeContainer: HTMLElement = document.querySelector("#routeContainer")

const regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"]

class Route {
    name: string;
    region: string;
    positions: boolean[];
    positionsSVG: string;
    dateCreated: string;
    description: string

    constructor(name: string, region: string, positions: boolean[], positionsSVG: string, dateCreated: string, description: string) {
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
}

setupRegionSelector();

// Note: we can assume the url contains a valid region because if it did not
// the nginx server would have redirected to the error page 
function getRegionFromUrl(): string {
    let urlRegion: string = window.location.pathname.split("/").pop()
    urlRegion = urlRegion.trim();
    urlRegion = urlRegion.split("-").join(" ");
    urlRegion = urlRegion.charAt(0).toUpperCase() + urlRegion.substring(1).toLowerCase();
    return urlRegion;
}

async function getRouteListFromEndpoint(apiEndpoint: URL, searchParams: URLSearchParams): Promise<Route[]> {
    apiEndpoint.search = searchParams.toString();

    let result: Route[] | number = await fetch(apiEndpoint).then(response => {
        if (!response.ok) { return response.status }

        return response.json().then(serverArray => {
            let routeList: Route[] = new Array(serverArray.length);
            for (let i = 0; i < routeList.length; i++) {
                const currRoute = serverArray[i];
                routeList[i] = new Route(currRoute["name"], currRoute["region"], currRoute["positions"], currRoute["positionsSvg"], currRoute["dateCreated"], currRoute["description"]);
            }
            return routeList;
        })
            .catch(() => 1)
    })

    if (Array.isArray(result)) {
        return result
    } else {
        console.error(result)
    }
}

function loadSortedRoutes(region: string) {
    const apiEndpoint = "/apis/getRouteListForecast"
    const queryParamsSort = {
        svgWidth: "250",
    }

    if (region == "Salt Lake") {
        queryParamsSort['region'] = 'salt-lake'
    } else {
        queryParamsSort['region'] = region.toLowerCase();
    }

    getRouteListFromEndpoint(new URL(apiEndpoint, window.location.origin), new URLSearchParams(queryParamsSort)).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route))
            routeContainer.appendChild(makeDividingLine());
        })
    });
}

function loadTimeOrdredRoutes(region: String) {
    const apiEndpoint = "/apis/getRouteListRecency"
    let queryParams = {
        svgWidth: "250",
    }

    if (region == "Salt Lake") {
        queryParams['region'] = 'salt-lake'
    } else {
        queryParams['region'] = region.toLowerCase();
    }

    getRouteListFromEndpoint(new URL(apiEndpoint, window.location.origin), new URLSearchParams(queryParams)).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route))
            routeContainer.appendChild(makeDividingLine());
        })
    });
}

// Creates and returns a html element which holds all the route information for a single route
function makeRouteContainer(route: Route): HTMLElement {
    // Outer container
    const routeContainer = document.createElement('section');
    routeContainer.classList.add('routeInformationSection')

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
    date.textContent = route.dateCreated
    const region = document.createElement('p');
    region.textContent = route.region

    textContainer.appendChild(date);
    textContainer.appendChild(region);

    // Image to go in outer container
    const image = document.createElement('svg')
    image.classList.add('routeRoseSvg')
    image.innerHTML = route.positionsSVG

    routeContainer.appendChild(textContainer);
    routeContainer.appendChild(image);

    return routeContainer
}

// Creates and returns a simple dividing line to divide route sections
function makeDividingLine(): HTMLHRElement {
    const divider: HTMLHRElement = document.createElement('hr')
    divider.classList.add('dividingLine')
    return divider;
}

// These functions simply sets up some nice animations for the top panel
function setupRegionSelector() {
    const regionList: HTMLUListElement = document.getElementById("regionList") as HTMLUListElement
    const regionTitle = document.getElementById("regionTitle")
    if (regions.includes(currentRegion)) {
        regionTitle.textContent = currentRegion;
    } else {
        regionTitle.textContent = "Salt Lake";
    }

    regionDiv.addEventListener("mouseenter", function() {
        regionDiv.style.backgroundColor = "#030f21"
        regionDiv.style.color = "#bbd2e9"
        toggleRegionPanel();
    });

    regionDiv.addEventListener("mouseleave", function() {
        regionDiv.style.backgroundColor = "rgb(117, 186, 223)"
        regionDiv.style.color = "#030f21"
        toggleRegionPanel();
    })

    regions.forEach(region => {
        const regionLink = document.createElement('a');
        regionLink.textContent = region;
        region = region.split(" ").join("-"); // Change here to dashes for link
        regionLink.href = "/routes/" + region;

        regionLink.classList.add('regionOption');
        regionList.appendChild(regionLink);
    })
}

function toggleRegionPanel() {
    const regionSelectorDiv: HTMLDivElement = document.getElementById("regionTitleWrapper") as HTMLDivElement

    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null; regionDiv.style.maxHeight = "100";
    } else {
        regionSelectorDiv.style.maxHeight = "500";
        regionDiv.style.maxHeight = "600";
    }
}
