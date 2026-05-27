// TODO: Populate region option dropdown
//         - Maybe then have the exit button go to that specific routes page?
// HACK: This could possibly get out of sync with the map of valid
// regions in the nginx config, the backend, and routes.ts maybe 
// look into this and find some way to do the check of if we are on
// a valid page without this list, maybe by some huristic about the
// state of the dom to see the differences between a valid and invalid page idk
const validRegionsAddRoute = ["Salt Lake", "Ogden", "Uintas", "Logan", "Provo", "Skyline", "Moab", "Abajos"];
const submitButton = document.getElementById("formSubmit");
const exitButton = document.getElementById("exitButton");
var positionsInteger = 0;
setupPositionsSelector();
setupRegionSelectorAddRoute();
function getRoutePositions() {
    return null;
}
exitButton.addEventListener("click", () => {
    window.location.href = "/routes/salt-lake";
});
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById("addRouteForm"));
    form.append("positions", positionsInteger.toString());
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
            console.log(positionsInteger);
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
