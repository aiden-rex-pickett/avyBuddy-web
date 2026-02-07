//Handles interaction with the backend as it pertains to the routes page

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

const regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"]
let lastSortingType;
let lastSortingRegion;

const routeListArea: HTMLDivElement = document.getElementById('routeList') as HTMLDivElement;

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
            clearRouteArea();
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
    clearRouteArea()
    let region = currentRegionTitle.textContent;

    if (region == "Salt Lake") {
        queryParamsSort['region'] = 'salt-lake'
    } else {
        queryParamsSort['region'] = region.toLowerCase();
    }

    clearRouteArea();
    getRouteListFromEndpoint(new URL(apiEndpointSort), new URLSearchParams(queryParamsSort)).then(routeList => {
        routeList.forEach(route => injectRouteIntoDOM(route))
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
        routeList.forEach(route => injectRouteIntoDOM(route))
    });

    lastSortingType = loadTimeOrdredRoutes;
    lastSortingRegion = region;
}

// This function simply injects a single route into the DOM, into the the route area hard-coded into the HTML
function injectRouteIntoDOM(route: Route) {
    //creates the container for the route object
    let routeDiv: HTMLDivElement = document.createElement('div');
    routeDiv.classList.add('routeContainer');
    routeDiv.addEventListener("click", function() {
        // TODO: Redo route page
    });

    let informationDiv: HTMLDivElement = document.createElement('div');
    informationDiv.classList.add('routeInformationContainer');

    let routeInformationContainers: HTMLDivElement[] = createRouteInformationContainers();
    function createRouteInformationContainers() {
        let nameDiv = document.createElement('div');
        let dateDiv = document.createElement('div');
        let descriptionDiv = document.createElement('div');
        let regionDiv = document.createElement('div');

        let dateText = document.createElement('p');
        let descriptionText = document.createElement('h2');
        let regionText = document.createElement('p');
        let nameText = document.createElement('h1');

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

    routeInformationContainers.forEach(container => {
        container.classList.add('routeInformationTextContainer'); informationDiv.appendChild(container);
    })

    routeDiv.appendChild(informationDiv);

    //creates svg container div
    let svgContainer: HTMLDivElement = document.createElement('div');
    svgContainer.style.width = "fit-content;"
    let svg = document.createElement('svg');
    svg.innerHTML = route.positionsSVG;
    svgContainer.appendChild(svg);

    //adds svg container to route container
    routeDiv.appendChild(svgContainer);

    //adds route container to the overall list area (hard-coded into dom in html)
    routeListArea.appendChild(routeDiv);

    //adds dividing line to overall list area
    let listDividingLine: HTMLHRElement = document.createElement('hr');
    listDividingLine.classList.add("dividingLine");

    routeListArea.appendChild(listDividingLine);
}

function clearRouteArea() {
    while (routeListArea.firstChild) {
        routeListArea.removeChild(routeListArea.firstChild);
    }
}

loadTimeOrdredRoutes("salt-lake");
setupRegionSelector();
