//--GLOBAL VARs, DOM ELEMENTS--
var modal = document.getElementById("addSomeone");
var btn = document.getElementById("add-chat");
var btnSend = document.getElementById("add-chat-btn");
var span = document.getElementsByClassName("close")[0];
var colorChange = document.getElementById("profileColor");
var chatContainer = document.getElementById("chats"); // Chat list container
const isHidden = () => modal.classList.contains("modalchat--hidden");

let myName;
let actualColor;
let isLoadingOlderChats = false; // Prevents multiple calls
let currentOffset = 1; // Offset for paginated chat loading

document.getElementById("loading-spinner").style.display = "block";

//--CHANGE COLOR PROFILE--

colorChange.addEventListener("change", function () {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/changeColor.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            Toastify({
                text: "Profile color changed!",
                duration: 3000,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    "line-height": "normal",
                    "font-size": "12px",
                    padding: "8px",
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () {}
            }).showToast();
        }
    };
    const id = JSON.stringify({ id: localStorage.getItem("id"), color: document.getElementById("profileColor").value });
    xhr.send(id);
});

//--SHOW/HIDE MODALS--

modal.addEventListener("transitionend", function () {
    if (isHidden()) {
        modal.style.display = "none";
    }
});

btn.addEventListener("click", function () {
    if (isHidden()) {
        modal.style.removeProperty("display");
        setTimeout(() => modal.classList.remove("modalchat--hidden"), 0);
    } else {
        modal.classList.add("modalchat--hidden");
    }
});

span.addEventListener("click", function () {
    if (isHidden()) {
        modal.style.removeProperty("display");
        setTimeout(() => modal.classList.remove("modalchat--hidden"), 0);
    } else {
        modal.classList.add("modalchat--hidden");
    }
});

modal.classList.add("modalchat--hidden");
modal.style.display = "none";

//--ADD USER--

btnSend.addEventListener("click", function () {
    let input = document.getElementById("add-name").value;
    if (input.trim() != "") {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.bruno.com.es/minichat/find.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        const body = JSON.stringify({ id: input });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let result = JSON.parse(xhr.responseText);
                if (result["success"] == false) {
                    Toastify({
                        text: "User not found.",
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        style: {
                            "line-height": "normal",
                            "font-size": "12px",
                            padding: "8px",
                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                        },
                        onClick: function () {}
                    }).showToast();
                    modal.classList.add("modalchat--hidden");
                } else if (result["success"] == true) {
                    const chatsString = localStorage.getItem("chats");
                    const chats = chatsString ? JSON.parse(chatsString) : [];
                    const nuevoElemento = input;

                    chats.push(nuevoElemento);
                    const data = JSON.stringify({
                        sender: localStorage.getItem("id"),
                        receiver: input,
                    });
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://api.bruno.com.es/minichat/sendRequest.php", true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onload = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            if (JSON.parse(xhr.response)["success"] == false) {
                                let status = JSON.parse(xhr.response)["status"];
                                // Handle different statuses here...
                            } else {
                                Toastify({
                                    text: "Chat request sent successfully!",
                                    duration: 3000,
                                    gravity: "top",
                                    position: "right",
                                    stopOnFocus: true,
                                    style: {
                                        "line-height": "normal",
                                        "font-size": "12px",
                                        padding: "8px",
                                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                                    },
                                    onClick: function () {}
                                }).showToast();
                            }
                        }
                    };
                    xhr.send(data);
                    document.getElementById("add-name").value = "";
                    modal.classList.add("modalchat--hidden");
                }
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    } else {
        Toastify({
            text: "Enter a valid username.",
            duration: 3000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                "line-height": "normal",
                "font-size": "12px",
                padding: "8px",
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            onClick: function () {}
        }).showToast();
    }
});

//--LIST CHATS--
function cortarString(texto, longitudMaxima) {
    if (texto.length > longitudMaxima) {
      // Elimina el último espacio si el último carácter es un espacio
      if (texto.charAt(longitudMaxima - 1) === ' ') {
        texto = texto.substring(0, longitudMaxima - 1);
      }
      return texto.substring(0, longitudMaxima) + '...';
    } else {
      return texto;
    }
  }


// Function to show the 3-dot loading animation
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading-indicator');
    loadingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatContainer.appendChild(loadingDiv);
}

// Function to hide the loading indicator
function hideLoadingIndicator() {
    const loadingDiv = document.querySelector('.loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Append chats to the DOM
function appendChatsToDOM(chats) {
    chats.forEach(chat => {
        let usernameLast, resultEndText, activeIndicator;

        if (chat.sender === myName) {
            usernameLast = chat.receiver;
            resultEndText = `<strong>You: </strong>${cortarString(decodeURIComponent(chat.text), 6)}`;
        } else {
            usernameLast = chat.sender;
            resultEndText = cortarString(decodeURIComponent(chat.text), 6);
        }

        activeIndicator = chat.active ? '<span class="active-indicator"></span>' : '';

        if (!document.getElementById("end-" + usernameLast)) {
            chatContainer.innerHTML += `
                <a class="chat p-2 pb-0 border-bottom text-decoration-none text-dark" href="./chat.html?id=${usernameLast}">
                    <div class="chat-image" style="background-color: ${chat.color};">${activeIndicator}</div>
                    <div class="chat-info ms-2">
                        <h6 class="chat-username text-capitalize">${usernameLast}</h6>
                        <p class="text-secondary chat-last" id="end-${usernameLast}">${resultEndText}</p>
                    </div>
                </a>`;
        }
    });
}

// List chats with pagination (offset)
function listChats(offset = 1) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/chatsChunk.php", true); // The 'chats.php' from earlier
    xhr.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
    );
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (!response.success) {
                console.error(response.error);
                return;
            }

            let { user, chats } = response.data;

            if (offset == 1) {
                myName = user.username;
                actualColor = user.color;

                document.getElementById("username-chats").innerHTML = myName;
                document.getElementById("profileColor").value = actualColor;
                document.getElementById("loading-spinner").style.display = "none";
            }

            appendChatsToDOM(chats);
            
            // If it's the last set of chats, remove the scroll event listener
            if (response.data.isTheEnd) {
                chatContainer.removeEventListener("scroll", scrollEventListener);
                chatContainer.innerHTML += `<span class="endOfChatsMessage">This is the end!</span>`
            }

            if(offset != 1) hideLoadingIndicator();  // Hide loading animation once chats are loaded
            isLoadingOlderChats = false;
        }
    };

    const requestData = JSON.stringify({ id: localStorage.getItem("id"), offset: offset });
    xhr.send(requestData);

    if(offset != 1) showLoadingIndicator();  // Show loading animation while fetching chats
}

let scrollEventListener = function () {
    if (chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 10) {
        if (!isLoadingOlderChats) {
            isLoadingOlderChats = true;
            currentOffset += 1; // Update offset for pagination
            listChats(currentOffset);
        }
    }
};

// SCROLL EVENT FOR LOADING OLDER CHATS
chatContainer.addEventListener("scroll", scrollEventListener);

// Initial load of chats
listChats();

function saveTime() {
    const now = new Date();
    const madridTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));

    // Obtener las partes de la fecha y hora
    const year = madridTime.getFullYear();
    const month = String(madridTime.getMonth() + 1).padStart(2, '0'); // Sumamos 1 al mes ya que en JavaScript los meses van de 0 a 11.
    const day = String(madridTime.getDate()).padStart(2, '0');
    const hours = String(madridTime.getHours()).padStart(2, '0');
    const minutes = String(madridTime.getMinutes()).padStart(2, '0');
    const seconds = String(madridTime.getSeconds()).padStart(2, '0');

    // Formatear la fecha y hora en el formato deseado
    const fechaFormateada = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    chrome.storage.sync.set({ 'lastTime': fechaFormateada });
    chrome.storage.sync.set({"id": localStorage.getItem("id")});
}

  
setInterval(saveTime, 10000); // Ejecuta la función cada 10 segundos
saveTime();