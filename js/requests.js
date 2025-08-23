//--GLOBAL VARs, DOM ELEMENTS--
var modal = document.getElementById("addSomeone");
var btn = document.getElementById("add-chat");
var btnSend = document.getElementById("add-chat-btn");
var span = document.getElementsByClassName("close")[0];
var colorChange = document.getElementById("profileColor");
const isHidden = () => modal.classList.contains("modalchat--hidden");

let chatsNum;

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
    if(input.trim() != ""){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.bruno.com.es/minichat/find.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        const body = JSON.stringify({
            id: input,
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let result = JSON.parse(xhr.responseText);
                console.log(result);
                if(result['success']==false){
                    Toastify({
                        text: "User not found.",
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            "line-height": "normal",
                            "font-size": "12px",
                            padding: "8px",
                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                        },
                        onClick: function(){} // Callback after click
                      }).showToast();
                    modal.classList.add("modalchat--hidden");
                }else if(result['success']==true){
                    const chatsString = localStorage.getItem('chats');
                    const chats = chatsString ? JSON.parse(chatsString) : [];
                    const nuevoElemento = input;

                    chats.push(nuevoElemento);
                    const data = JSON.stringify({
                        sender: localStorage.getItem("id"),
                        receiver: input,
                        //messageText: "Hello! Let's talk! 👋",
                        });
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "https://api.bruno.com.es/minichat/sendRequest.php", true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.onload = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            if(JSON.parse(xhr.response)["success"] == false){
                                let status = JSON.parse(xhr.response)["status"];
                                if(status == 1){
                                    Toastify({
                                        text: "You already have sent a request or vice versa!",
                                        duration: 3000,
                                        gravity: "top", // `top` or `bottom`
                                        position: "right", // `left`, `center` or `right`
                                        stopOnFocus: true, // Prevents dismissing of toast on hover
                                        style: {
                                            "line-height": "normal",
                                            "font-size": "12px",
                                            padding: "8px",
                                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                                        },
                                        onClick: function(){}
                                        }).showToast();
                                }else if(status == 5){
                                    Toastify({
                                        text: "You can't send a request to yourself",
                                        duration: 3000,
                                        gravity: "top", // `top` or `bottom`
                                        position: "right", // `left`, `center` or `right`
                                        stopOnFocus: true, // Prevents dismissing of toast on hover
                                        style: {
                                            "line-height": "normal",
                                            "font-size": "12px",
                                            padding: "8px",
                                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                                        },
                                        onClick: function(){}
                                        }).showToast();
                                }else if(status == 2){
                                    Toastify({
                                        text: "The requests has been reset, it might be in your request inbox",
                                        duration: 3000,
                                        gravity: "top", // `top` or `bottom`
                                        position: "right", // `left`, `center` or `right`
                                        stopOnFocus: true, // Prevents dismissing of toast on hover
                                        style: {
                                            "line-height": "normal",
                                            "font-size": "12px",
                                            padding: "8px",
                                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                                        },
                                        onClick: function(){}
                                        }).showToast();
                                }
                                else if(status == 0){
                                    Toastify({
                                        text: "You are already chatting with this user!",
                                        duration: 3000,
                                        gravity: "top", // `top` or `bottom`
                                        position: "right", // `left`, `center` or `right`
                                        stopOnFocus: true, // Prevents dismissing of toast on hover
                                        style: {
                                            "line-height": "normal",
                                            "font-size": "12px",
                                            padding: "8px",
                                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                                        },
                                        onClick: function(){}
                                        }).showToast();
                                }
                            }else{
                                Toastify({
                                    text: "Chat request sent successfully!",
                                    duration: 3000,
                                    gravity: "top", // `top` or `bottom`
                                    position: "right", // `left`, `center` or `right`
                                    stopOnFocus: true, // Prevents dismissing of toast on hover
                                    style: {
                                        "line-height": "normal",
                                        "font-size": "12px",
                                        padding: "8px",
                                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                                    },
                                    onClick: function(){}
                                    }).showToast();
                                    //document.location.reload();
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
    }else{
        Toastify({
            text: "Enter a valid username.",
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                "line-height": "normal",
                "font-size": "12px",
                padding: "8px",
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            onClick: function(){} // Callback after click
          }).showToast();
    }
});

function listRequests() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/viewMyRequests.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            let data = result['data'];
            if (data.length != 0) {
                chatsNum = data.length;
                for (let i = 0; i < data.length; i++) {
                    let resultEndText;
                    document.getElementById("requests").innerHTML += `<a class="chat p-2 text-decoration-none text-dark" data-username="${data[i][0][0]["username"]}" id="request-container">
                        <div class="chat-image" style="background-color: ${data[i][0][0]["color"]};"></div>
                        <div class="chat-info ms-2 m-auto">
                            <h6 class="chat-username d-inline-block text-capitalize mb-0">${data[i][0][0]["username"]}</h6>
                            <div class="d-inline-block ms-2">
                                <button data-username="${data[i][0][0]["username"]}" data-status="1" class="btn-requests btn-requests-accept">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                                    </svg>
                                </button>
                                <button data-username="${data[i][0][0]["username"]}" data-status="0" class="btn-requests btn-requests-deny">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </a>`;

                    document.querySelectorAll(`.btn-requests-accept`).forEach(function(button) {
                        button.addEventListener("click", function() {
                            handleButtonClick(button.getAttribute("data-username"), 1);
                        });
                    });
                    
                    document.querySelectorAll(`.btn-requests-deny`).forEach(function(button) {
                        button.addEventListener("click", function() {
                            handleButtonClick(button.getAttribute("data-username"), 0);
                        });
                    });
                }
            }else{
                document.getElementById("requests").innerHTML += "<span id='noRequestsText'>You don't have any requests right now!</span>";
                localStorage.setItem("requests",0);
            }
        }
    };
    let username = localStorage.getItem("id");
    const id = JSON.stringify({ username: username, });
    xhr.send(id);
}

function handleButtonClick(username, status) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/changeRequests.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let result = JSON.parse(xhr.responseText);
            let success = result['success'];
            if (success) {
                if(status == 1){
                    Toastify({
                        text: "Friend added successfully!",
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            "line-height": "normal",
                            "font-size": "12px",
                            padding: "8px",
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        },
                        onClick: function(){}
                      }).showToast();
                      document.querySelector(`.chat[data-username="${username}"]`).remove();
                }else{
                    Toastify({
                        text: "Request rejected successfully!",
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            "line-height": "normal",
                            "font-size": "12px",
                            padding: "8px",
                            background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                        },
                        onClick: function(){} // Callback after click
                      }).showToast();
                      document.querySelector(`.chat[data-username="${username}"]`).remove();
                }
                localStorage.setItem("requests",Number(localStorage.getItem("requests"))-1);
            }else{
                Toastify({
                    text: "We cannot proccess that request now. Sorry :(",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        "line-height": "normal",
                        "font-size": "12px",
                        padding: "8px",
                        background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                    },
                    onClick: function(){} // Callback after click
                  }).showToast();
            }
        }
    };
    const data = JSON.stringify({ username: username, status: status, id: localStorage.getItem("id")});
    xhr.send(data);
}

listRequests();