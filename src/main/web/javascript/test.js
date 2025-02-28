let svgString;

let requestUrl = 'http://localhost:5501/forecast?region=salt-lake&svgWidth=500'
console.log(requestUrl);

fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        svgString = data.avalanche_problem_1.danger_rose_svg;
        const container = document.getElementById("svgTest");
        container.innerHTML = svgString;
    })
    .catch(error => console.error(error));