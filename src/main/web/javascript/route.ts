// TODO: It's so over for this design. This must go. We are going to refactor
//      - Rewrite all of this. It is garbage.
//      - Rewrite the HTML for the associated routes page too. Also garbage
//      - Instead of refilling the route area each time you click on a route,
//        have the route page be a seperate page. We will have to add another endpoint with
//        a get parameter that is the route name but that's okay. Better seperation of concerns
//      - Time ordering and sorting stuff is good, we will continue to use that

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
    //Endpoint info
    //For running off of local server
    // const apiEndpointSort = "http://localhost:8080/apis/getRouteListForecast"
    //For running from IDE
    const apiEndpointSort = "http://localhost:5501/getRouteListForecast"
    const queryParamsSort = {
        svgWidth: "250",
    }
    let region = currentRegionTitle.textContent;

    if (region == "Salt Lake") {
        queryParamsSort['region'] = 'salt-lake'
    } else {
        queryParamsSort['region'] = region.toLowerCase();
    }

    getRouteListFromEndpoint(new URL(apiEndpointSort), new URLSearchParams(queryParamsSort)).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainer(route))
            routeContainer.appendChild(makeDividingLine());
        })
    });
    lastSortingType = loadSortedRoutes;
    lastSortingRegion = region;
}

function loadTimeOrdredRoutes(region: String) {
    //Endpoint info
    //For running off of local server
    // const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
    //For running from IDE
    const apiEndpoint = "http://localhost:5501/getRouteListRecency"
    let queryParams = {
        svgWidth: "250",
    }

    if (region == "Salt Lake") {
        queryParams['region'] = 'salt-lake'
    } else {
        queryParams['region'] = region.toLowerCase();
    }

    getRouteListFromEndpoint(new URL(apiEndpoint), new URLSearchParams(queryParams)).then(routeList => {
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
