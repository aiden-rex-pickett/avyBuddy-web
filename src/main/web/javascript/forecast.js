//Main forcast fetch for the routes page

//Endpoint info
const apiEndpoint = "http://localhost:5501/forecast"
const queryParams = {
    region: "salt-lake",
    svgWidthMain: 500,
    svgWidthProblems: 250
}

//document elements
const mainRoseSvg = document.getElementById("mainRoseSvg");
const bottomLine = document.getElementById("bottomLineText")

getData(queryParams);

async function getData(queryParams) {
    const requestUrl = new URL(apiEndpoint);
    const requestParams = new URLSearchParams(queryParams);
    requestUrl.search = requestParams.toString();
    
    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setupForecastPage(data);
        })
        .catch(error => console.error(error))
}

function setupForecastPage(data) {
    //Sets main rose svg
    mainRoseSvg.innerHTML = data.main_rose_svg;

    //Sets bottoms line text that appears next to or under it
    bottomLine.innerHTML = data.bottom_line;

    //Sets all the individual avalanche problems
    let problemArray = [data.avalanche_problem_1, data.avalanche_problem_2, data.avalanche_problem_3]
    for (let i = 0; i < problemArray.length; i++) {
        if (problemArray[i] != null) {
            let divList = createProblemDom(problemArray[i]);
            let divToClick = divList[1];
            let divToClose = divList[0];
            divToClick.addEventListener("click", function(e) {
                toggleProblemDescription(divToClose, divToClick)
            });
        }
    }
}

//Wrapped function to use for event listener, closes proper div
function toggleProblemDescription(divToClose, divToSetBackground) {
    if (divToClose.style.display == "none") {
        divToClose.style.display = "flex";
        divToSetBackground.classList = ["problemHeaderClicked"];
    } else {
        divToClose.style.display = "none";
        divToSetBackground.classList = ["problemHeader"]
    }
}

//Creates the avalanche problem dom, pretty ugly but works
//Puts it in problemArea div
function createProblemDom(problem) {
    const problemArea = document.getElementById("problemArea");
    const problemDiv = document.createElement("div");
    const problemTitleDiv = document.createElement("div");
    const problemWrapper = document.createElement("div");

    problemTitleDiv.classList.add("problemHeaderWrap");

    let problemTitle = document.createElement("h1");
    problemTitle.classList.add("problemHeader");
    problemTitle.textContent = problem.problem_title;
    problemWrapper.style = "border-top: 4px solid #030f21";
    problemTitleDiv.appendChild(problemTitle);
    problemWrapper.appendChild(problemTitleDiv);

    problemDiv.style = "display: none"
    problemDiv.classList.add("problem");

    let problemTextWrapper = document.createElement("div");
    problemTextWrapper.classList.add("problemDescription")
    let problemText = document.createElement("p");
    problemTextWrapper.appendChild(problemText);
    problemText.innerHTML = problem.problem_description;
    problemDiv.appendChild(problemTextWrapper);

    let svg = document.createElement("svg");
    svg.innerHTML = problem.danger_rose_svg;
    problemDiv.appendChild(svg);

    problemWrapper.appendChild(problemDiv);

    problemArea.appendChild(problemWrapper);

    return [problemDiv, problemTitle];
}
