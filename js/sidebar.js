let sidebarContainer = document.getElementById("sidebarContainer");
const section = sidebarContainer.getAttribute("data-section");

async function loadSidebar(){
    sidebarContainer.innerHTML = await(await fetch('../html/sidebar.html')).text();

    document.getElementById("sidebarSection-"+section).classList.remove("text-secondary");
    document.getElementById("sidebarSection-"+section).classList.add("text-primary");

    if(localStorage.getItem("requests") != 0 && section != "requests"){
        document.getElementById('notifications-requests').classList.remove('d-none');
    }
}

loadSidebar();