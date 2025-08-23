document.querySelector("#signoff_button_settings").addEventListener("click", function() {
    localStorage.clear();
    window.location.href = "./create.html";
});


//--SHOW/HIDE MODALS--

var modal = document.getElementById("getKey");
var btn = document.getElementById("reveal-security-key");
var btnSend = document.getElementById("get-key-btn");
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
    let text = document.getElementById("getKeyInput").value;
    if(text == "CONFIRM"){
        navigator.clipboard.writeText(localStorage.getItem("id")).then(function() {
            Toastify({
                text: "Security key in the clipboard!",
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
        }, function(err) {
            Toastify({
                text: "Error copying the security key.",
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
              document.getElementById("securityKeyText").innerHTML = localStorage.getItem("id");
        });
    }
});

document.getElementById("open-popup").addEventListener("click", function () {
    newwindow=window.open("./chats.html","MiniChat PopUp",'height=370,width=280');
       if (window.focus) {newwindow.focus()}
});