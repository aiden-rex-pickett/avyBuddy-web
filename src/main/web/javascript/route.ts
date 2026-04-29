// TODO: More to be done now that inital crap is cleaned up. I want to make this stateless
// it might be a bit slower but we should.
// JS:
//   1. fetch the endpoint with that name, load the routes just for that
//   2. if they click the sort by forecast, simply clear route sections and hit that endpoint, and fill again
//   This way the whole thing has much less state
// I will finally stop prematurely optimizing by not pulling all the routes, not doing xyz, whatever.
// All that is great but I just gotta finish this project bruh its been too long

// HACK: This could possibly get out of sync with the map of valid regions in the nginx config
// maybe look into this and find some way to do the check of if we are on a valid page without
// this list, maybe by some huristic about the state of the dom to see the differences between 
// a valid and invalid page idk
const validRegions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"]

// Simple struct-like container for a single route object, for use in constructing the route sections
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

// The HTML element where the region for the page is displayed
const currentRegionDiv: HTMLDivElement = document.getElementById("regionButton") as HTMLDivElement

// The HTML element where the route sections will be injected into
const routeContainer: HTMLElement = document.querySelector("#routeContainer")

// The region for the page
const region = getRegionFromUrl();

setupRegionSelector();

loadTimeOrdredRoutes(region);

// Gets the region in the form that the endpoint would understand from the URL
//
// Note: we can assume the url contains a valid region because if it did not
// the nginx server would have redirected to the error page 
function getRegionFromUrl(): string {
    let urlRegion: string = window.location.pathname.split("/").pop()
    urlRegion = urlRegion.trim();
    urlRegion = urlRegion.split(" ").join("-");
    urlRegion = urlRegion.toLowerCase();
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

    const url = new URL(apiEndpoint, window.location.origin)
    url.searchParams.set("svgWidth", "250")
    getRouteListFromEndpoint(url).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route))
            routeContainer.appendChild(makeDividingLine());
        })
    });
}

// Loads and fills the route listing area with a list of routes ordered
// by how recently they were created
function loadTimeOrdredRoutes(region: string) {
    const apiEndpoint = "/apis/getRouteListRecency"

    const url = new URL(apiEndpoint, window.location.origin)
    url.searchParams.set("svgWidth", "250")
    url.searchParams.set("region", region)
    getRouteListFromEndpoint(url).then(routeList => {
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
    const routeRegion = document.createElement('p');
    routeRegion.textContent = route.region

    textContainer.appendChild(date);
    textContainer.appendChild(routeRegion);

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
    regionTitle.textContent = makePretty(region);

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

    validRegions.forEach(validRegion => {
        const regionLink = document.createElement('a');
        regionLink.textContent = validRegion;
        validRegion = validRegion.split(" ").join("-"); // Change here to dashes for link
        regionLink.href = "/routes/" + validRegion;

        regionLink.classList.add('regionOption');
        regionList.appendChild(regionLink);
    })
}

// Makes a region string that is in a form that the endpoint
// would understand into a nice Looking space separated string
// of capitalized words for the user to oodle at.
function makePretty(region: string) {
    let regionWords = region.trim().toLowerCase().split("-");
    for (let i = 0; i < regionWords.length; i++) {
        regionWords[i] = regionWords[i].charAt(0).toUpperCase() + regionWords[i].slice(1);
    }
    return regionWords.join(" ");
}

// Function for opening and closing the region selector 
// panel when teh user hovers their mouse over it
function toggleRegionPanel() {
    const regionSelectorDiv: HTMLDivElement = document.getElementById("regionTitleWrapper") as HTMLDivElement

    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null; currentRegionDiv.style.maxHeight = "100";
    } else {
        regionSelectorDiv.style.maxHeight = "500";
        currentRegionDiv.style.maxHeight = "600";
    }
}
