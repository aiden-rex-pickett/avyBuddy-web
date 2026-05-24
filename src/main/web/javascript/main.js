const buttonOpen = document.getElementById("menuOpen");
const buttonClose = document.getElementById("menuClose");
const sidebar = document.getElementById("sidebarId");
const accountLink = document.getElementById("header-login");

buttonOpen.addEventListener('click', () => sidebar.style.display = 'block');
buttonClose.addEventListener('click', () => sidebar.style.display = 'none');

// So that if it gets navigated back to from a login page it reloads to update
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
})

fetch("/apis/status").then((response) => response.json()).then((data) => {
    if (data["loggedIn"] && data["loggedIn"] == true) {
        accountLink.textContent = data["username"]
        accountLink.href = data["username"]
    }
})

