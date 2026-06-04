class PageRoute {
    name: string;
    id: number;
    region: string;
    positions: boolean[];
    positionsSVG: string;
    dateCreated: string;
    description: string;
    accountUsername: string;

    constructor(id: number, name: string, region: string, positions: boolean[], positionsSVG: string, dateCreated: string, description: string, accountUsername: string) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
        this.accountUsername = accountUsername
    }
}

var route: PageRoute;

const path: string = "/apis" + window.location.pathname
fetch(path).then(response => response.json()).then(async json => {
    if (json["Error"] != undefined) {
        loadErrorPage(window.location.pathname.replace("/route/", ""))
    } else {
        route = new PageRoute(json["id"], json["name"], json["region"], json["positions"], json["positionsSvg"], json["dateCreated"], json["description"], json["accountUsername"]);
        await loadRoutePage(route);
    }
}).catch(err => { console.error(err) })

const main = document.querySelector("main");

async function loadRoutePage(route: PageRoute) {
    // TODO: Add edit and delete route buttons, but only if the user owns the route.
    // Check by hitting status and comparing the username to the one in the account username.
    const routeHeaderWrap = document.createElement("div");
    routeHeaderWrap.classList.add("routeHeaderWrap");

    const routeHeader = document.createElement("div");
    routeHeader.classList.add("routeHeader");

    const routeTitle = document.createElement("h1");
    routeTitle.classList.add("topline");
    routeTitle.textContent = route.name;

    const routeRegionHtml = document.createElement("p");
    routeRegionHtml.classList.add("topline");
    routeRegionHtml.innerHTML = "For the <strong>" + route.region + "</strong> region"

    const routeCreationInformation = document.createElement("p");
    routeCreationInformation.innerHTML = 'Created on ' + route.dateCreated + ', by <a class="register-link" href="/account/' + route.accountUsername + '" + >' + route.accountUsername + "</a>";

    const dividingLine = document.createElement("hr");

    const backButtonWrap = document.createElement("div");
    backButtonWrap.classList.add("backButtonWrap");
    backButtonWrap.classList.add("regionSelector");

    const backButton = document.createElement("a");
    backButton.classList.add("backButton");
    backButton.textContent = "View more " + route.region + " routes";
    backButton.href = "/routes/" + route.region

    backButtonWrap.appendChild(backButton);

    routeHeader.appendChild(routeTitle);
    routeHeader.appendChild(routeRegionHtml);
    routeHeader.appendChild(routeCreationInformation);
    routeHeader.appendChild(dividingLine);

    routeHeaderWrap.appendChild(routeHeader);
    routeHeaderWrap.appendChild(backButtonWrap);

    main.appendChild(routeHeaderWrap);

    const routeDescriptionWrap = document.createElement("div");
    routeDescriptionWrap.classList.add("routeDescription");

    const routeDesciptionTextWrap = document.createElement("div");
    routeDesciptionTextWrap.classList.add("routeDescriptionLeft");

    const routeDescription = document.createElement("p");
    routeDescription.textContent = route.description;

    const routeDescriptionButtonWrap = document.createElement("div");
    routeDescriptionButtonWrap.classList.add("buttonWrap");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Route"
    editButton.classList.add("backButton")
    const deleteButton = document.createElement("a");
    deleteButton.textContent = "Delete Route"
    deleteButton.classList.add("backButton")
    deleteButton.addEventListener("click", deleteRoute)

    if (await ownsRoute(route.accountUsername)) {
        routeDescriptionButtonWrap.appendChild(editButton);
        routeDescriptionButtonWrap.appendChild(deleteButton);
    }

    routeDesciptionTextWrap.appendChild(routeDescription);
    routeDesciptionTextWrap.appendChild(routeDescriptionButtonWrap);

    const routeRoseWrap = document.createElement("div");
    routeRoseWrap.classList.add("mainRoseSvg")
    routeRoseWrap.id = "mainRoseSvg";
    routeRoseWrap.innerHTML = route.positionsSVG;

    routeDescriptionWrap.appendChild(routeDesciptionTextWrap);
    routeDescriptionWrap.appendChild(routeRoseWrap);

    main.appendChild(routeDescriptionWrap);
}

function loadErrorPage(invalidRouteName: string) {
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
    returnLink.classList.add("regionSelector")
    returnLink.textContent = "Go Back To Routes";

    returnButtonWrapper.appendChild(returnLink);

    errorMessageWrapper.appendChild(errorMessage);
    errorMessageWrapper.appendChild(returnButtonWrapper);

    main.appendChild(errorMessageWrapper);
}

async function ownsRoute(username: string): Promise<boolean> {
    return await fetch("/apis/status").then(response => response.json()).then(data => {
        if (data["loggedIn"] && data["username"] == username) {
            return true;
        } else {
            return false;
        }
    })
}

function deleteRoute() {
    const conf = confirm("Are you sure you want to delete?")
    if (!conf) {
        return
    }
    fetch("/apis/deleteRoute/" + route.id, {
        method: "DELETE",
        headers: {
            'X-XSRF-TOKEN': getCsrfTokenDetail(),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(response => {
        if (response.status == 200) {
            window.location.href = "/routes/" + route.region
        } else {
            alert("Route Deletion failed: " + response.statusText)
        }
    })
}

function getCsrfTokenDetail() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}
