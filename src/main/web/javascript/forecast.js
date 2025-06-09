//Main forcast fetch for the forecast page
//TODO: Make selection region selection + disclaimer that full forecast should be read

//Endpoint info
//For running off of local server
//const apiEndpoint = "http://localhost:8080/apis/forecast"
//For running from IDE
const apiEndpoint = "http://localhost:5501/forecast"
const queryParams = {
    region: "salt-lake",
    svgWidthMain: 500,
    svgWidthProblems: 250
}

//document elements
const mainRoseSvg = document.getElementById("mainRoseSvg");
const bottomLine = document.getElementById("bottomLineText")
//used to select region
const regionTitle = document.getElementById("regionTitle");
const regionTitleWrapper = document.getElementById("regionTitleWrapper");


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
function toggleProblemDescription(divToClose, divClicked) {
    if (divToClose.style.maxHeight) {
        divToClose.style.maxHeight = null;
        divToClose.style.padding = null;
    } else {
        let textDivHeight = divToClose.querySelector('.problemDescription').scrollHeight;
        let svgHeight = divToClose.querySelector('svg').scrollHeight;
        let expandedHeight = Math.max(textDivHeight, svgHeight);

        divToClose.style.maxHeight = expandedHeight
        divToClose.style.paddingTop = 10;
        divToClose.style.paddingBottom = 10;
    }
    
    divClicked.classList.toggle('problemHeaderClicked')
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

regionTitle.addEventListener('mouseenter', function () {
    regionTitle.style.backgroundColor = "#bbd2e9"
    toggleRegionPanel();
})

regionTitle.addEventListener('mouseleave', function () {
    regionTitle.style.backgroundColor = "rgb(117, 186, 223)"
    toggleRegionPanel();
})

function setupTabsTransition(){
    regionTitleWrapper.classList.add('regionTitleWrapper');
}

setupTabsTransition();

function toggleRegionPanel() {
    if (regionTitleWrapper.style.maxHeight) {
        regionTitleWrapper.style.maxHeight = null;
    } else {
        regionTitleWrapper.style.maxHeight = 500;
    }
}

//TODO FINISH THIS!!!