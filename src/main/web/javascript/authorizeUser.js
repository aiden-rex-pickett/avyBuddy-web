document.addEventListener("DOMContentLoaded", isLoggedIn);
async function isLoggedIn() {
    fetch("/apis/status").then(response => response.json()).then(data => {
        if (!data["loggedIn"] || data["loggedIn"] == false) {
            window.location.href = "/login";
        }
    }).catch(() => {
        window.location.href = "/login";
    });
}
