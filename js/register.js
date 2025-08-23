const registerButton = document.getElementById("register-button");
const loginInput = document.getElementById("login-input");
const colorInput = document.getElementById("profileColor");

registerButton.addEventListener("click", function() {
    const inputValue = loginInput.value.trim();
    const colorValue = colorInput.value.trim();
    if (inputValue !== "") {
        const profileId = "id" + Math.random().toString(16).slice(2);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.bruno.com.es/minichat/register.php");
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            username: inputValue,
            color: colorValue,
            id: profileId,
        });
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let result = JSON.parse(xhr.responseText);
                if(result['success']==false && result['error']=="1"){
                    Toastify({
                        text: "Username already in use.",
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
                }else if(result['success']==true){
                    localStorage.setItem("id", profileId);
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://api.bruno.com.es/minichat/findMe.php", true);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                        window.location.href = "./popup.html";
                        }
                    };
                    const id = JSON.stringify({id:localStorage.getItem("id")});
                    xhr.send(id);
                }
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };
        xhr.send(body);
    } else {
        Toastify({
            text: "Please enter a valid username.",
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

//--SHOW/HIDE MODALS--

var modal = document.getElementById("signWithKey");
var btn = document.getElementById("login-button");
var btnSend = document.getElementById("sign-in-btn");
var span = document.getElementsByClassName("close")[0];
const isHidden = () => modal.classList.contains("modalchat--hidden");

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

btnSend.addEventListener("click", function () {
    localStorage.setItem("id", document.getElementById("signWithKeyInput").value);
    window.location.href = "./chats.html"
});