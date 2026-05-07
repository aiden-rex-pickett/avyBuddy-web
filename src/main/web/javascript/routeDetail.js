// TODO: The whole thing. This page is pretty simple tho
//       1. Get the get parameter for the route name out of the url
//       2. Send request to (not yet implemented) api endpoint to get single route by name
//       3. Load in all the data
class PageRoute {
    name;
    region;
    positions;
    positionsSVG;
    dateCreated;
    description;
    constructor(name, region, positions, positionsSVG, dateCreated, description) {
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
}
const path = "/apis" + window.location.pathname;
fetch(path).then(response => response.json()).then(json => {
    if (json["Error"] != undefined) {
        loadErrorPage(window.location.pathname.replace("/route/", ""));
    }
    else {
        const route = new PageRoute(json["name"], json["region"], json["positions"], json["positionsSvg"], json["dateCreated"], json["description"]);
        loadRoutePage(route);
    }
}).catch(err => { console.error(err); });
const main = document.querySelector("main");
function loadRoutePage(route) {
    const routeHeaderWrap = document.createElement("div");
    routeHeaderWrap.classList.add("routeHeaderWrap");
    const routeHeader = document.createElement("div");
    routeHeader.classList.add("routeHeader");
    const routeTitle = document.createElement("h1");
    routeTitle.classList.add("topline");
    routeTitle.textContent = route.name;
    const routeRegionHtml = document.createElement("p");
    routeRegionHtml.classList.add("topline");
    routeRegionHtml.innerHTML = "For the <strong>" + route.region + "</strong> region";
    const routeCreationDate = document.createElement("p");
    routeCreationDate.textContent = "Created on " + route.dateCreated;
    const dividingLine = document.createElement("hr");
    routeHeader.appendChild(routeTitle);
    routeHeader.appendChild(routeRegionHtml);
    routeHeader.appendChild(routeCreationDate);
    routeHeaderWrap.appendChild(routeHeader);
    routeHeaderWrap.appendChild(dividingLine);
    main.appendChild(routeHeaderWrap);
    const routeDescriptionWrap = document.createElement("div");
    routeDescriptionWrap.classList.add("routeDescription");
    const routeDescription = document.createElement("p");
    routeDescription.textContent = route.description;
    const routeRoseWrap = document.createElement("div");
    routeRoseWrap.classList.add("mainRoseSvg");
    routeRoseWrap.id = "mainRoseSvg";
    routeRoseWrap.innerHTML = route.positionsSVG;
    routeDescriptionWrap.appendChild(routeDescription);
    routeDescriptionWrap.appendChild(routeRoseWrap);
    main.appendChild(routeDescriptionWrap);
}
function loadErrorPage(invalidRouteName) {
    const errorMessageWrapper = document.createElement("div");
    errorMessageWrapper.style = "display: flex; flex-direction: column; align-items: center; justify-content: space-around";
    const errorMessage = document.createElement("h1");
    errorMessage.textContent = "We couldn't find a route named " + invalidRouteName + ", try another route instead";
    const returnButtonWrapper = document.createElement("div");
    returnButtonWrapper.classList.add("routeButtonArea");
    returnButtonWrapper.style = "height: 100px";
    returnButtonWrapper.id = "routeButtonArea";
    const returnLink = document.createElement("a");
    returnLink.style = "text-decoration: none";
    returnLink.href = "/routes/salt-lake";
    returnLink.id = "regionButton";
    returnLink.classList.add("regionSelector");
    returnLink.textContent = "Go Back To Routes";
    returnButtonWrapper.appendChild(returnLink);
    errorMessageWrapper.appendChild(errorMessage);
    errorMessageWrapper.appendChild(returnButtonWrapper);
    main.appendChild(errorMessageWrapper);
}
