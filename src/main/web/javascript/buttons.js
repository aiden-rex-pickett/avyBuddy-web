const buttonOpen = document.getElementById("menuOpen");
const buttonClose = document.getElementById("menuClose");
const sidebar = document.getElementById("sidebarId");

function openButton() {
    sidebar.style.display = 'block';
}

function closeButton() {
    sidebar.style.display = 'none';
}

buttonOpen.addEventListener('click', openButton);
buttonClose.addEventListener('click', closeButton);
