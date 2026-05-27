// TODO: Populate region option dropdown
//         - Maybe then have the exit button go to that specific routes page?
const submitButton = document.getElementById("formSubmit");
const exitButton = document.getElementById("exitButton");
var positionsInteger = 0;
setupPositionsSelector();
exitButton.addEventListener("click", () => {
    window.location.href = "/routes/salt-lake";
});
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const form = new FormData(document.getElementById("addRouteForm"));
    form.append("positions", getRoutePositions());
});
function getRoutePositions() {
    return null;
}
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
