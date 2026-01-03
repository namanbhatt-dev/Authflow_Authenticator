var menuIcon = document.querySelector(".menu");
var sidebar = document.querySelector(".sidebar");

menuIcon.onclick = function() {
    sidebar.classList.toggle("small-sidebar");
}