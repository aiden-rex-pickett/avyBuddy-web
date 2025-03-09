//Main forcast fetch for the routes page

//Endpoint info
const apiEndpoint = "http://localhost:5501/forecast"
const queryParams = {
    region: "salt-lake",
    svgWidth: 400
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
}
