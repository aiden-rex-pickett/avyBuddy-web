// Simple struct-like container for a single route object, for use in constructing the route sections
class RouteAccount {
    name: string;
    id: number;
    region: string;
    positions: boolean[];
    positionsSVG: string;
    dateCreated: string;
    description: string

    constructor(id: number, name: string, region: string, positions: boolean[], positionsSVG: string, dateCreated: string, description: string) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.positions = positions;
        this.positionsSVG = positionsSVG;
        this.dateCreated = dateCreated;
        this.description = description;
    }
}

const accountNameElement = document.getElementById("accountName")
const accountDateElement = document.getElementById("accountDate")

const accountName = getAccountNameFromUrl();

fillAccountInformation()

loadTimeOrdredRoutesForAccount();

const routeContainerAccount: HTMLElement = document.getElementById("routeContainer")

function getAccountNameFromUrl(): string {
    let urlAccount: string = window.location.pathname.split("/").pop()
    urlAccount = urlAccount.trim();
    return urlAccount;
}

// Gets the region in the form that the endpoint would understand from the URL
//
// Note: we can assume the url contains a valid region because if it did not
// the nginx server would have redirected to the error page 
function getRegionFromUrlAccount(): string {
    let urlRegion: string = window.location.pathname.split("/").pop()
    urlRegion = urlRegion.trim();
    return urlRegion;
}

// Loads and fills the route listing area with a list of routes ordered
// by how recently they were created
function loadTimeOrdredRoutesForAccount() {
    const apiEndpoint = "/apis/getRouteListAccount"

    const url = new URL(apiEndpoint, window.location.origin)
    url.searchParams.set("svgWidth", "250")
    url.searchParams.set("username", accountName)
    getRouteListFromEndpointAccount(url).then(routeList => {
        routeList.forEach(route => {
            routeContainer.appendChild(makeRouteContainerAccount(route))
            routeContainer.appendChild(makeDividingLineAccount());
        })
    }).catch((errObj) => {
        routeContainer.appendChild(makeErrorContainerAccount(errObj));
    })
}

// Creates and returns a html element which holds all 
// the route information for a single route
function makeRouteContainerAccount(route: Route): HTMLElement {
    // Outer container
    const routeContainer = document.createElement('section');
    routeContainer.classList.add('routeInformationSection')
    routeContainer.addEventListener("click", () => {
        window.location.href = "/route/" + route.id;
    })

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
function makeDividingLineAccount(): HTMLHRElement {
    const divider: HTMLHRElement = document.createElement('hr')
    divider.classList.add('dividingLine')
    return divider;
}

function makeErrorContainerAccount(errObj): HTMLElement {
    const errorMessageContainer = document.createElement("section");
    errorMessageContainer.classList.add("errorMessageContainer")

    const errorMessageHeader = document.createElement("h1");
    errorMessageHeader.textContent = "Oh no!"

    const errorMessageInfo = document.createElement("p");
    errorMessageInfo.textContent = errObj.message

    errorMessageContainer.appendChild(errorMessageHeader)
    errorMessageContainer.appendChild(errorMessageInfo)

    return errorMessageContainer
}

// Function that gets a list of Route objects from a given API endpoint
// the endpoint should be one that returns a list of routes in the expected form
function getRouteListFromEndpointAccount(apiEndpoint: URL): Promise<RouteAccount[]> {
    return new Promise<RouteAccount[]>((resolve, reject) => {
        fetch(apiEndpoint).then(async (response) => { // When we have recevied a response from fetch
            if (!response.ok) { // If not good data, reject promise with status code
                const data = await response.json();
                if (data["Error"]) {
                    reject({ code: response.status, message: data["Error"] })
                } else {
                    reject({ code: response.status, message: response.statusText })
                }
            } else {
                const data = await response.json();
                let routeList: RouteAccount[] = new Array(data.length);
                for (let i = 0; i < routeList.length; i++) {
                    const currRoute = data[i];
                    routeList[i] = new RouteAccount(currRoute["id"], currRoute["name"], currRoute["region"], currRoute["positions"], currRoute["positionsSvg"], currRoute["dateCreated"], currRoute["description"]);
                }
                resolve(routeList); // If good data, fulfill with route list
            }
        }).catch(() => { // Only if catastrophic fetch failure
                accountDateElement.style.display = "none"
            reject({ code: "", message: "The user does not exist" })
        });
    })
}

async function fillAccountInformation() {
    accountNameElement.textContent = accountName;
    accountDateElement.textContent = "Account created on " + await fetch("/apis/account/" + accountName).then(response => response.json()).then(data => data["creationDate"])
}
