//Handles interaction with the backend as it pertains to the routes page

//Adds all the event listeners
const addRouteButton:HTMLButtonElement = document.getElementById("addRoute") as HTMLButtonElement;
addRouteButton.addEventListener("click", addRoute);
const sortByForecastButton:HTMLButtonElement = document.getElementById("searchRoutes") as HTMLButtonElement
sortByForecastButton.addEventListener("click", loadRoutes)

const currentRegionDiv:HTMLDivElement = document.getElementById("regionButton") as HTMLDivElement
const currentRegionTitle:HTMLParagraphElement = document.getElementById("regionTitle") as HTMLParagraphElement
const regionSelectorDiv:HTMLDivElement = document.getElementById("regionTitleWrapper") as HTMLDivElement
const regionList:HTMLUListElement = document.getElementById("regionList") as HTMLUListElement

const regions = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"]

setupRegionSelector();

function setupRegionSelector() {
    currentRegionDiv.addEventListener("mouseenter", function() {
        currentRegionDiv.style.backgroundColor = "#030f21"
        currentRegionDiv.style.color = "#bbd2e9"
        toggleRegionPanel();
    });

    currentRegionDiv.addEventListener("mouseleave", function () {
        currentRegionDiv.style.backgroundColor = "rgb(117, 186, 223)"
        currentRegionDiv.style.color = "#030f21"
        toggleRegionPanel();
    })

    regions.forEach(region => {
        let regionText = document.createElement('p');
        regionText.textContent = region;
        regionText.addEventListener('click', () => {
            while(routeListArea.firstChild){
                routeListArea.removeChild(routeListArea.firstChild);
            } 
            parseRoutes(region);
        })

        regionText.classList.add('regionOption');
        regionList.appendChild(regionText);
    })
}

function toggleRegionPanel() {
    if (regionSelectorDiv.style.maxHeight) {
        regionSelectorDiv.style.maxHeight = null;
        currentRegionDiv.style.maxHeight = "100";
    } else {
        regionSelectorDiv.style.maxHeight = "500";
        currentRegionDiv.style.maxHeight = "600";
    }
}

const routeListArea:HTMLDivElement = document.getElementById('routeList') as HTMLDivElement;

class Route {
    name:string;
    region:string;
    positions:boolean[];
    positionsSVG:string;
    dateCreated:string;
    description:string

    constructor(name:string, region:string, positions:boolean[], positionsSVG:string, dateCreated:string, description:string) {
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
}

function addRoute() {
    console.log("add")
}

function loadRoutes() {
    console.log("load")
}

//Endpoint info
    //For running off of local server
    // const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
    //For running from IDE
    const apiEndpoint = "http://localhost:5501/getRouteListRecency"
    let queryParams = {
        numRoutes: 10,
        numRoutesLoaded: 0,
        svgWidth: 250,
        region: 'logan'
    }

function parseRoutes(region) {
    if(region == "Salt Lake"){
        queryParams['region'] = 'salt-lake'
    } else {
        queryParams['region'] = region.toLowerCase();
    }

    getRoutesByRecency(apiEndpoint, queryParams).then(routesList => {
        routesList.forEach(route => {
            injectRouteIntoDOM(route);
            queryParams.numRoutesLoaded++;
        });
    });
}

function injectRouteIntoDOM(route:Route) {
    //creates the container for the route object
    let routeDiv:HTMLDivElement = document.createElement('div');
    routeDiv.classList.add('routeContainer');

    let informationDiv:HTMLDivElement = document.createElement('div');
    informationDiv.classList.add('routeInformationContainer');

    let routeInformationContainers:HTMLDivElement[] = createRouteInformationContainers();
        function createRouteInformationContainers() {
            let nameDiv = document.createElement('div');
            let dateDiv = document.createElement('div');
            let descriptionDiv = document.createElement('div');
            let regionDiv = document.createElement('div');

            let nameText = document.createElement('h1');
            let dateText = document.createElement('p');
            let descriptionText = document.createElement('h2');
            let regionText = document.createElement('p');

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
    let svgContainer:HTMLDivElement = document.createElement('div');
    svgContainer.style.width = "fit-content;"
    let svg = document.createElement('svg');
    svg.innerHTML = route.positionsSVG;
    svgContainer.appendChild(svg);

    //adds svg container to route container
    routeDiv.appendChild(svgContainer);

    //adds route container to the overall list area (hard-coded into dom in html)
    routeListArea.appendChild(routeDiv);
    
    //adds dividing line to overall list area
    let listDividingLine:HTMLHRElement = document.createElement('hr');
    listDividingLine.classList.add("dividingLine");

    routeListArea.appendChild(listDividingLine);
}

function getRoutesByRecency(apiEndpoint, queryParams) {
    const requestURL = new URL(apiEndpoint);
    const requestParams = new URLSearchParams(queryParams);
    requestURL.search = requestParams.toString();

    return fetch(requestURL)
        .then(response => response.json())
        .then(data => {            
        let routesList:Route[] = [];
        for (let i = 0; i < data.length; i++) {
            let currentRoute = data[i];
            routesList[i] = new Route(currentRoute.name, currentRoute.region, currentRoute.positions, currentRoute.positionsSvg, currentRoute.dateCreated, currentRoute.description);
        }

        return routesList;
    })
}

parseRoutes("salt-lake");