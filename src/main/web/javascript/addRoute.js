// HACK: This could possibly get out of sync with the map of valid
// regions in the nginx config, the backend, and routes.ts maybe 
// look into this and find some way to do the check of if we are on
// a valid page without this list, maybe by some huristic about the
// state of the dom to see the differences between a valid and invalid page idk
const validRegionsAddRoute = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
const submitButton = document.getElementById("formSubmit");
const exitButton = document.getElementById("exitButton");
const selectedRegion = document.getElementById("region");
var positionsInteger = 0;
setupPositionsSelector();
setupRegionSelectorAddRoute();
function getRoutePositions() {
    return null;
}
exitButton.addEventListener("click", () => {
    window.location.href = "/routes/" + selectedRegion.textContent.split(" ").join("-").toLowerCase();
});
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById("addRouteForm"));
    const name = form.get("name");
    if (!name) {
        raiseError("Route must have a name");
        return;
    }
    const description = form.get("description");
    if (!description) {
        raiseError("Route must have a description");
        return;
    }
    if (positionsInteger == 0) {
        raiseError("Route must pass through at least one position on the rose");
        return;
    }
    if (!(selectedRegion.textContent)) {
        raiseError("Route must have a region");
        return;
    }
    const parameters = {
        name: name,
        description: description,
        positions: positionsInteger,
        region: selectedRegion.textContent.split(" ").join("-").toLowerCase(),
    };
    fetch("/apis/addRoute", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfTokenAddRoute(),
        },
        body: JSON.stringify(parameters),
    }).then(async (response) => {
        if (response.status == 401) {
            raiseError("You must be logged in to create a route");
            return;
        }
        else if (!response.ok) {
            raiseError("Server Error. Code " + response.status + ", " + response.statusText);
            return;
        }
        else {
            clearError();
            const routeId = parseInt(await response.text());
            if (routeId > 0) {
                window.location.href = "/route/" + routeId;
                return;
            }
            raiseError("Invalid Account attempting to create route");
        }
    }).catch(err => {
        raiseError("Fetch Error: " + err);
        return;
    });
    console.log(parameters);
});
function setupPositionsSelector() {
    const positions = document.querySelectorAll(".rose-segment");
    positions.forEach(pos => {
        pos.addEventListener("click", (event) => {
            pos.children[0].classList.toggle("rose-segment-clicked");
            if (pos.children[0].classList.contains("rose-segment-clicked")) {
                positionsInteger |= 1 << +pos.id;
            }
            else {
                positionsInteger &= ~(1 << +pos.id);
            }
        });
    });
}
function setupRegionSelectorAddRoute() {
    const regionOptions = document.getElementById("regionOptions");
    const currentRegion = document.getElementById("region");
    validRegionsAddRoute.forEach(region => {
        const listItem = document.createElement("h2");
        listItem.textContent = region;
        regionOptions.appendChild(listItem);
        listItem.addEventListener("click", () => {
            currentRegion.textContent = region;
        });
    });
}
const errorParagraph = document.getElementById("errorText");
function raiseError(err) {
    errorParagraph.textContent = err;
    errorParagraph.style.display = "block";
}
function clearError() {
    errorParagraph.textContent = "";
    errorParagraph.style.display = "none";
}
function getCsrfTokenAddRoute() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
    return '';
}
