const buttonOpen = document.getElementById("menuOpen");
const buttonClose = document.getElementById("menuClose");
const sidebar = document.getElementById("sidebarId");
const accountLink = document.getElementById("header-login");
const logout = document.getElementById("header-logout");


buttonOpen.addEventListener('click', () => sidebar.style.display = 'block');
buttonClose.addEventListener('click', () => sidebar.style.display = 'none');

// So that if it gets navigated back to from a login page it reloads to update
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
})

logout.addEventListener('click', (event) => {
    event.preventDefault();
    fetch("/apis/logout", {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': getCsrfTokenMain(),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).finally(window.location.reload())
})

fetch("/apis/status").then((response) => response.json()).then((data) => {
    if (data["loggedIn"] && data["loggedIn"] == true) {
        accountLink.textContent = data["username"]
        accountLink.href = "/account/" + data["username"]
        logout.style.display = "block"
    }
})

function getCsrfTokenMain() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
}
