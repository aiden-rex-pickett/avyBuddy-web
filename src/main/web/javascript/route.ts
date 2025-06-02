//Handles interaction with the backend as it pertains to the routes page

//Adds all the event listeners
const addRouteButton:HTMLButtonElement = document.getElementById("addRoute") as HTMLButtonElement;
addRouteButton.addEventListener("click", addRoute);

const routeListArea:HTMLDivElement = document.getElementById('routeList') as HTMLDivElement;

class Route {
    name:string;
    region:string;
    positions:boolean[];
    positionsSVG:string;
    dateCreated:string;

    constructor(name:string, region:string, positions:boolean[], positionsSVG:string, dateCreated:string) {
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
    }
}

document.addEventListener("DOMContentLoaded" , function () {
    loadRoutes();

    //TODO this currently loads the same routes over and over, make it so it loads new ones
    let observer:IntersectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(element => {
            if (element.isIntersecting) {
                loadRoutes();
            }
        });
    })

    observer.observe(document.getElementById("footer"));
})



function addRoute() {

}

function loadRoutes() {
    parseRoutes();
}

//Endpoint info
    //For running off of local server
    //const apiEndpoint = "http://localhost:8080/apis/getRouteListRecency"
    //For running from IDE
    const apiEndpoint = "http://localhost:5501/getRouteListRecency"
    const queryParams = {
        numRoutes: 10,
        svgWidth: 250
    }

function parseRoutes() {
    getRoutesByRecency(apiEndpoint, queryParams).then(routesList => {
        routesList.forEach(route => {
            injectRouteIntoDOM(route);
        });
    });
}

function injectRouteIntoDOM(route:Route) {
    let routeDiv:HTMLDivElement = document.createElement('div');
    routeDiv.style = "display: flex; justify-content: right";

    //creates svg container div
    let svgContainer:HTMLDivElement = document.createElement('div');
    svgContainer.style = "width: fit-content;"
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
            let route:Route = new Route(currentRoute.name, currentRoute.region, currentRoute.positions, currentRoute.positionsSvg, currentRoute.dateCreated);
            routesList[i] = route;
        }

        return routesList;
    })
}