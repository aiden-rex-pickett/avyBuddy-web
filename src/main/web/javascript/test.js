
const text = document.getElementById("fetchDataTest");

fetch("http://localhost:5501/Forecast/logan")
    .then(response => response.json())
    .then(data => {
        text.textContent = data.bottomLine
    })
    .catch(error => console.error(error));