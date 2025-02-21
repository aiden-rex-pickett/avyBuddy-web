
fetch("http://localhost:8080/forecast/salt-lake")
    .then(response => response.json())
        .then(data => console.log(data))
    .catch(error => console.error(error));