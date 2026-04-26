// TODO: More to be done now that inital crap is cleaned up. I want to make this stateless
// it might be a bit slower but we should.
// HTML:
//   - Make it so that this endpoint now is postpended by the region to search in.
//     - This will involve directing all routes/salt-lake, routes/logan, routes/uintas, etc to routes
//     - Will have to start running off of apache/nginx for this to work, plus make a rule like the above
//     - Have to also make urls in nginx to return 404 for pages that are not valid
//       - Probably will have seperate .map file which the authoritative truth on the list of regions to search for
//   - Make dropdown buttons now just a links to the respective endpoints
//   - Make a simple 404 page for nginx to serve when any route page that is not well defined in the .map file
// JS:
//   1. Read the end of the url to see which route to search for
//   2. fetch the endpoint with that name
//   3. Buttons for the specific route will not just redirect to the other pages
//   This way the whole thing is stateless
// I will finally stop prematurely optimizing by not pulling all the routes, not doing xyz, whatever.
// All that is great but I just gotta finish this project bruh its been too long

//Adds all the event listeners
const addRouteButton: HTMLButtonElement = document.getElementById("addRoute") as HTMLButtonElement;
addRouteButton.addEventListener("click", addRoute);
const sortByForecastButton: HTMLButtonElement = document.getElementById("searchRoutes") as HTMLButtonElement
sortByForecastButton.addEventListener("click", loadSortedRoutes)

const buttonArea = document.getElementById('routeButtonArea');
const routesTitleArea = document.getElementById('routeHeaderArea');

const currentRegionDiv: HTMLDivElement = document.getElementById("regionButton") as HTMLDivElement
const currentRegionTitle: HTMLParagraphElement = document.getElementById("regionTitle") as HTMLParagraphElement
const regionSelectorDiv: HTMLDivElement = document.getElementById("regionTitleWrapper") as HTMLDivElement
const regionList: HTMLUListElement = document.getElementById("regionList") as HTMLUListElement
const routeContainer: HTMLElement = document.querySelector("#routeContainer")

const regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"]
let lastSortingType;
let lastSortingRegion;

// This function simply sets up some nice animations for the top panel
function setupRegionSelector() {
    currentRegionDiv.addEventListener("mouseenter", function() {
        currentRegionDiv.style.backgroundColor = "#030f21"
        currentRegionDiv.style.color = "#bbd2e9"
        toggleRegionPanel();
    });

    currentRegionDiv.addEventListener("mouseleave", function() {
        currentRegionDiv.style.backgroundColor = "rgb(117, 186, 223)"
        currentRegionDiv.style.color = "#030f21"
        toggleRegionPanel();
    })

    regions.forEach(region => {
        let regionText = document.createElement('p');
        regionText.textContent = region;
        regionText.addEventListener('click', () => {
            currentRegionTitle.textContent = region;
            loadTimeOrdredRoutes(region);
        })

        regionText.classList.add('regionOption');
        regionList.appendChild(regionText);
    })
}

function toggleRegionPanel() {
    if (regionSelectorDiv.style.maxHeight) { regionSelectorDiv.style.maxHeight = null; currentRegionDiv.style.maxHeight = "100"; } else {
        regionSelectorDiv.style.maxHeight = "500";
        currentRegionDiv.style.maxHeight = "600";
    }
}

function addRoute() {
    console.log("add")
}

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

function loadSortedRoutes() {
    const apiEndpoint = "/apis/getRouteListForecast"
    const queryParamsSort = {
        svgWidth: "250",
    }
    let region = currentRegionTitle.textContent;

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
    lastSortingType = loadSortedRoutes;
    lastSortingRegion = region;
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

    lastSortingType = loadTimeOrdredRoutes;
    lastSortingRegion = region;
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

loadTimeOrdredRoutes("salt-lake");
setupRegionSelector();
