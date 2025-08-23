const messages = document.getElementsByClassName("message-delete");

const urlParams = new URLSearchParams(window.location.search);

let userId;

if (urlParams.has("id")) {
  const id = urlParams.get("id");
  enviarDatosAlServidor({ id });
  userId = id;
}

let isInternalIdActive = false;

function enviarDatosAlServidor(data) {
  const xhrPost = new XMLHttpRequest();
  xhrPost.open("POST", "https://api.bruno.com.es/minichat/userinfo.php", true);
  xhrPost.setRequestHeader(
    "Content-Type",
    "application/json;charset=UTF-8"
  );
  xhrPost.onreadystatechange = async function () {
    if (xhrPost.readyState === 4 && xhrPost.status === 200) {
      let respuesta = JSON.parse(xhrPost.responseText);
      respuesta = JSON.parse(respuesta["data"]);

      //TIME LOGIC
      let horaInicial = respuesta["lastActivity"];

      if (horaInicial != null || horaInicial != undefined) {
        let zonaHorariaOrigen = "Europe/Madrid";

        // Obtener la zona horaria local del usuario
        let zonaHorariaDestino =
          Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Crear un objeto DateTime con la hora inicial en la zona horaria de origen
        let fechaOrigen = luxon.DateTime.fromFormat(
          horaInicial,
          "yyyy-MM-dd HH:mm:ss",
          { zone: zonaHorariaOrigen }
        );

        // Convertir la hora a la zona horaria de destino (hora local del usuario)
        let fechaDestino = fechaOrigen.setZone(zonaHorariaDestino);

        // Formatear la hora en la zona horaria de destino
        let horaFormateada = fechaDestino.toFormat(
          "d 'of' LLLL 'at' HH:mm"
        );

        if (respuesta[0]["active"] == true) {
          if (!isInternalIdActive)
            intervalID = setInterval(reloadMessages, 1000);
          isInternalIdActive = true;
          horaFormateada = "Active now";
        } else {
          if (isInternalIdActive) clearInterval(intervalID);
          isInternalIdActive = false;
        }


        document.getElementById(
          "profile-info"
        ).innerHTML += `<div class="chat-profile ms-2">
              <div class="chat-image" style="background-color: ${respuesta["color"]};"></div>
              <h6 class="chat-username text-capitalize m-auto ms-2" style="
              padding-top: .2rem;">${respuesta["username"]}
              <br>
              <span class="text-secondary" id="userLastActivity" style="font-size: xx-small;">${horaFormateada}</span></h6>      
              </div>`;
      } else {
        document.getElementById(
          "profile-info"
        ).innerHTML += `<div class="chat-profile ms-2">
              <div class="chat-image" style="background-color: ${respuesta["color"]};"></div>
              <h6 class="chat-username text-capitalize m-auto ms-2">${respuesta["username"]}</h6>      
              </div>`;
      }
    }
  };
  xhrPost.send(JSON.stringify(data));
}

function checkIfOnline(data) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.bruno.com.es/minichat/userinfo.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = async function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let respuesta = JSON.parse(xhr.responseText);
      respuesta = JSON.parse(respuesta["data"]);

      let horaInicial = respuesta["lastActivity"];

      if (horaInicial != null || horaInicial != undefined) {
        let zonaHorariaOrigen = "Europe/Madrid";
        let zonaHorariaDestino =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        let fechaOrigen = luxon.DateTime.fromFormat(
          horaInicial,
          "yyyy-MM-dd HH:mm:ss",
          { zone: zonaHorariaOrigen }
        );
        let fechaDestino = fechaOrigen.setZone(zonaHorariaDestino);
        let horaFormateada = fechaDestino.toFormat("d 'of' LLLL 'at' HH:mm");

        if (respuesta[0]["active"] == true) {
          if (!isInternalIdActive)
            intervalID = setInterval(reloadMessages, 1000);
          isInternalIdActive = true;
          horaFormateada = "Active now";
        } else {
          if (isInternalIdActive) clearInterval(intervalID);
          isInternalIdActive = false;
        }
        document.getElementById("userLastActivity").innerHTML = horaFormateada;
      }
    }
  };
  xhr.send(JSON.stringify(data));
}

var myName;

function getMyName() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.bruno.com.es/minichat/findMe.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      myName = JSON.parse(xhr.responseText)["username"];
      getMessages();
      setInterval(function () {
        checkIfOnline({ id: userId, whoIsThis: localStorage.getItem("id") });
      }, 3000);
    }
  };
  const id = JSON.stringify({ id: localStorage.getItem("id") });
  xhr.send(id);
}

getMyName();
let time;
let messagesNum;

function reloadMessages() {
  getMessages();
}

let gettingMessages = false;
let intervalID;
let acutalSection = 1;
let lastMessageId = 0;
let miDiv = document.getElementById("messages");
// Define the scrollEventListener function
let scrollEventListener = function () {
  if (miDiv.scrollTop <= 80 && !gettingMessages) {
    acutalSection += 1;
    gettingMessages = true;
    getMessages(acutalSection);
  }
};

// Attach the scrollEventListener to the scroll event
miDiv.addEventListener("scroll", scrollEventListener);

function getMessages(loadingSection = false) {
  let user2 = urlParams.get("id");
  let user1 = localStorage.getItem("id");
  const xhr = new XMLHttpRequest();
  let localSection = 1;
  if (loadingSection != false) localSection = loadingSection;
  xhr.open("POST", "https://api.bruno.com.es/minichat/newChat.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let respuesta = JSON.parse(xhr.responseText);
      let status = JSON.parse(respuesta["success"]);
      if (status == true) {
        let messagesContainer = document.getElementById("totalMessages");
        let data = respuesta["data"];
        if (!loadingSection && respuesta["lastId"] != lastMessageId) {
          if (respuesta["isTheEnd"] == true && respuesta["section"] != 1) {
            miDiv.removeEventListener("scroll", scrollEventListener);
          }
          messagesContainer.innerHTML = "";
          lastMessageId = respuesta["lastId"];
          messagesNum = data.length;
          for (let i = 0; i < data.length; i++) {
            const horaInicial = data[i]["timestamp"];
            const zonaHorariaOrigen = "Europe/Madrid";

            // Obtener la zona horaria local del usuario
            const zonaHorariaDestino =
              Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Crear un objeto DateTime con la hora inicial en la zona horaria de origen
            const fechaOrigen = luxon.DateTime.fromFormat(
              horaInicial,
              "yyyy-MM-dd HH:mm:ss",
              { zone: zonaHorariaOrigen }
            );

            // Convertir la hora a la zona horaria de destino (hora local del usuario)
            const fechaDestino = fechaOrigen.setZone(zonaHorariaDestino);

            // Formatear la hora en la zona horaria de destino
            const horaFormateada = fechaDestino.toFormat("yyyy-MM-dd HH:mm:ss");

            let hours = decodeURIComponent(data[i]["timestamp"]).substring(
              11,
              16
            );
            const [hora, minutos] = hours.split(":").map(Number);
            const fecha = new Date();
            fecha.setHours(hora, minutos);
            data[i]["text"] = data[i]["text"].replace(/(<([^>]+)>)/gi, "");
            if (time == null || time == undefined) {
              messagesContainer.innerHTML += `
              <span class="timemessage time-me">${decodeURIComponent(
                horaFormateada
              ).substring(8, 10)}/${decodeURIComponent(
                data[i]["timestamp"]
              ).substring(5, 7)} ${decodeURIComponent(
                data[i]["timestamp"]
              ).substring(11, 16)}</span>
              `;
              time = fecha;
            } else {
              const diferenciaMinima = 5;
              const diferenciaMilisegundos = fecha - time;
              const diferenciaMinutos = diferenciaMilisegundos / 60000;
              if (diferenciaMinutos >= diferenciaMinima) {
                messagesContainer.innerHTML += `
                <span class="timemessage time-me">${decodeURIComponent(
                  horaFormateada
                ).substring(11, 16)}</span>
                `;
                time = fecha;
              } else if (fecha < time) {
                messagesContainer.innerHTML += `
                <span class="timemessage time-me">${decodeURIComponent(
                  horaFormateada
                ).substring(8, 10)}/${decodeURIComponent(
                  data[i]["timestamp"]
                ).substring(5, 7)} ${decodeURIComponent(
                  data[i]["timestamp"]
                ).substring(11, 16)}</span>
                `;
                time = fecha;
              }
            }
            let finalText = "";
            finalText = convertirEnlacesATags(
              decodeURIComponent(data[i]["text"])
            );

            if (data[i]["sender"] == myName.toLowerCase()) {
              messagesContainer.innerHTML += `
              <div class="message message-delete send-me" data-id="${data[i]["id"]}">${finalText}</div>
              `;
            } else {
              messagesContainer.innerHTML += `
              <div class="message send-you">${finalText}</div>
              `;
            }
          }
          const miDiv = document.getElementById("messages");
          miDiv.scrollTop = miDiv.scrollHeight;
        } else if (loadingSection != false) {
          let scrollContainer = document.getElementById("messages");
          let containerHeight = scrollContainer.scrollHeight;
          let currentScrollPosition = scrollContainer.scrollTop;
          let distanceFromBottom = containerHeight - currentScrollPosition;

          if (respuesta["isTheEnd"] == true && respuesta["section"] != 1) {
            miDiv.removeEventListener("scroll", scrollEventListener);
          } else {
            miDiv.addEventListener("scroll", scrollEventListener);
          }
          let actualMessages =
            document.getElementById("totalMessages").innerHTML;
          messagesContainer.innerHTML = "";

          if (data.length == 0) {
            miDiv.removeEventListener("scroll", scrollEventListener);
          }

          for (let i = 0; i < data.length; i++) {
            //TIME LOGIC
            const horaInicial = data[i]["timestamp"];
            const zonaHorariaOrigen = "Europe/Madrid";

            // Obtener la zona horaria local del usuario
            const zonaHorariaDestino =
              Intl.DateTimeFormat().resolvedOptions().timeZone;

            // Crear un objeto DateTime con la hora inicial en la zona horaria de origen
            const fechaOrigen = luxon.DateTime.fromFormat(
              horaInicial,
              "yyyy-MM-dd HH:mm:ss",
              { zone: zonaHorariaOrigen }
            );

            // Convertir la hora a la zona horaria de destino (hora local del usuario)
            const fechaDestino = fechaOrigen.setZone(zonaHorariaDestino);

            // Formatear la hora en la zona horaria de destino
            const horaFormateada = fechaDestino.toFormat("yyyy-MM-dd HH:mm:ss");

            let hours = decodeURIComponent(data[i]["timestamp"]).substring(
              11,
              16
            );
            const [hora, minutos] = hours.split(":").map(Number);
            const fecha = new Date(decodeURIComponent(data[i]["timestamp"]));
            data[i]["text"] = data[i]["text"].replace(/(<([^>]+)>)/gi, "");
            fecha.setHours(hora, minutos);
            if (time == null || time == undefined) {
              messagesContainer.innerHTML += `<span class="timemessage time-me">${decodeURIComponent(
                horaFormateada
              ).substring(8, 16)}</span>`;
              time = fecha;
            } else {
              const diferenciaMinima = 5;
              const diferenciaMilisegundos = fecha - time;
              const diferenciaMinutos = diferenciaMilisegundos / 60000;
              if (diferenciaMinutos >= diferenciaMinima) {
                messagesContainer.innerHTML += `<span class="timemessage time-me">${decodeURIComponent(
                  horaFormateada
                ).substring(11, 16)}</span>`;
                time = fecha;
              } else if (fecha < time) {
                messagesContainer.innerHTML += `<span class="timemessage time-me">${decodeURIComponent(
                  horaFormateada
                ).substring(8, 16)}</span>`;
                time = fecha;
              }
            }
            let finalText = "";
            finalText = convertirEnlacesATags(
              decodeURIComponent(data[i]["text"])
            );

            if (data[i]["sender"] == myName.toLowerCase()) {
              messagesContainer.innerHTML += `
              <div class="message message-delete send-me" data-id="${data[i]["id"]}">${finalText}</div>
              `;
            } else {
              messagesContainer.innerHTML += `
              <div class="message send-you">${finalText}</div>
              `;
            }
          }
          messagesContainer.innerHTML += actualMessages;
          messagesNum = data.length;

          let newContainerHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop = newContainerHeight - distanceFromBottom;
          gettingMessages = false;
        }
        for (const message of messages) {
          message.addEventListener("contextmenu", showContextMenu);
        }
      }
    }
  };
  const data = JSON.stringify({
    user1: user1,
    user2: user2,
    section: localSection,
  });
  xhr.send(data);
}
document
  .getElementById("button-send-message")
  .addEventListener("click", function () {
    let text = document.getElementById("chat-input").value;
    let username = localStorage.getItem("id");

    if (text.trim() != "") {
      sendMessage(text, username);
    }
  });

document
  .getElementById("chat-input")
  .addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      let text = document.getElementById("chat-input").value;
      let username = localStorage.getItem("id");

      if (text.trim() != "") {
        sendMessage(text, username);
      }
    }
  });

  let lastMessageTime = 0; // Keeps track of the last message timestamp

  function sendMessage(text, username) {
    const currentTime = Date.now(); // Get the current time in milliseconds

    // Check if the user is trying to send a message within 1.5 seconds
    if (currentTime - lastMessageTime < 1500) {
      // Show a Toastify notification for spamming
      Toastify({
        text: "You're sending messages too fast!",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          "line-height": "normal",
          "font-size": "12px",
          padding: "8px",
          background:
            "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
      return; // Exit the function early
    }

    // Update the timestamp for the last message
    lastMessageTime = currentTime;

    // Proceed with sending the message
    const data = JSON.stringify({
      sender: username,
      receiver: urlParams.get("id"),
      messageText: encodeURIComponent(text),
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/sendChat.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let respuesta = JSON.parse(xhr.responseText);
        respuesta = JSON.parse(respuesta["success"]);
        document.getElementById("chat-input").value = "";
        getMessages();
      }
    };
    xhr.send(data);
  }

function convertirEnlacesATags(texto) {
  const match = texto.match(/\[sticker\](.*?)\[\/sticker\]/i);
  // Check if a match is found and extract the content
  if (match && match[1]) {
    // Create the image element
    const img = document.createElement('img');
  
    // Set attributes for the image
    img.width = 50;
    img.className = 'chatSticker';
    img.alt = 'This sticker was probably deleted...';
    img.src = match[1]; // Sticker URL
  
    // Add an error handler for fallback image
    img.onerror = function() {
      this.src = chrome.runtime.getURL('src/img/stickerNotFound.png');
      console.log(this);
    };
  
    // Return the outer HTML of the image element as a string to inject it
    return img.outerHTML;
  }

  var enlaceRegex =
    /(?:https?:\/\/)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?::\d+)?(?:\/\S*)?/gi;

  var textoConvertido = texto.replace(enlaceRegex, function (match) {
    var href = match.startsWith("http") ? match : "http://" + match;
    return '<a target="_blank" href="' + href + '">' + match + "</a>";
  });

  return textoConvertido;
}

getMessages();
//CLICK DERECHO MAIN MENU

const contextMenu = document.getElementById("context-menu");
const deleteOption = document.getElementById("delete");

let selectedMessageId = null;

function showContextMenu(event) {
  event.preventDefault();

  // Selecciona el contenedor del mensaje, no el sticker
  const messageElement = event.target.closest('.message');
  
  if (messageElement) {
    selectedMessageId = messageElement.getAttribute("data-id");
    contextMenu.style.display = "block";
    contextMenu.style.position = "absolute";

    if (event.clientX < window.innerWidth / 2) {
      contextMenu.style.left = `${event.clientX}px`;
      contextMenu.style.top = `${event.clientY}px`;
      contextMenu.style.borderTopLeftRadius = "0px";
      contextMenu.style.borderTopRightRadius = "6px";
    } else {
      contextMenu.style.left = `${event.clientX - 100}px`;
      contextMenu.style.top = `${event.clientY}px`;
      contextMenu.style.borderTopRightRadius = "0px";
      contextMenu.style.borderTopLeftRadius = "6px";
    }
  }
}

function hideContextMenu() {
  contextMenu.style.display = "none";
}

contextMenu.style.display = "none";

document.addEventListener("click", function (e) {
  if (!stickersPopup.contains(e.target) && e.target !== stickersBtn) {
    stickersPopup.classList.add("d-none");
  }

  hideContextMenu();
});

deleteOption.addEventListener("click", () => {
  if (selectedMessageId) {
    let temporalName = selectedMessageId;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/deleteMessage.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        Toastify({
          text: "Message deleted!",
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
          onClick: function () {},
        }).showToast();
        document.querySelector(
          '[data-id="' + temporalName + '"]'
        ).style.display = "none";
        selectedMessageId = null;
        getMessages();
      } else {
        selectedMessageId = null;
      }
    };
    const id = JSON.stringify({
      id: localStorage.getItem("id"),
      messageId: selectedMessageId,
    });
    xhr.send(id);
  }
  hideContextMenu();
});

//--SHOW/HIDE MODALS--

var modal = document.getElementById("deleteUser");
var btn = document.getElementById("deleteFriend");
var btnSend = document.getElementById("confirmDeleteUser");
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
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.bruno.com.es/minichat/deleteChat.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      location.href = "./chats.html";
    } else {
      console.log("Error");
    }
  };
  const id = JSON.stringify({
    id: localStorage.getItem("id"),
    receiver: urlParams.get("id"),
  });
  xhr.send(id);
});

const stickersBtn = document.getElementById("stickers-btn");
const stickersPopup = document.getElementById("stickersPopup");

// Show the stickers popup when button is clicked
stickersBtn.addEventListener("click", function (e) {
  e.stopPropagation(); // Prevent event from reaching document
  stickersPopup.classList.remove("d-none");
});

const localStickersStorage = "https://api.bruno.com.es/minichat/stickers/";

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.bruno.com.es/minichat/getUserStickers.php");
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
const body = JSON.stringify({
  id: localStorage.getItem("id"),
});
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    let result = JSON.parse(xhr.responseText);
    let data = result["data"];

    if (result["success"]) {
      data.forEach((sticker) => {
        document.getElementById("stickersContainer").innerHTML +=
          getStickerHTML(sticker.id, sticker.extension, sticker.storage);
      });

      // Get all elements with the class "stickerImage"
      const stickerImages = document.getElementsByClassName("stickerImage");

      // Loop through each element in the collection
      for (let i = 0; i < stickerImages.length; i++) {
        stickerImages[i].addEventListener("click", function (e) {
          // Get the data-id attribute of the clicked element
          const dataId = e.target.getAttribute("data-id");
          let username = localStorage.getItem("id");
          sendMessage("[sticker]" + e.target.src + "[/sticker]", username);
        });
      }
    } else {
      Toastify({
        text: "Internal error while getting your stickers...",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          "line-height": "normal",
          "font-size": "12px",
          padding: "8px",
          background:
            "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  } else {
    Toastify({
      text: "Internal error while getting your stickers...",
      duration: 3000,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        "line-height": "normal",
        "font-size": "12px",
        padding: "8px",
        background:
          "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
};
xhr.send(body);

function getStickerHTML(id, extension, storage) {
  switch (storage) {
    case "local":
      return `<img class="stickerImage" src="${localStickersStorage}${id}.${extension}" alt="Some minichat sticker..." height="50" width="50" style="cursor: pointer;" data-id="${id}"></img>`;
    default:
      return `<img class="stickerImage" src="${localStickersStorage}${id}.${extension}" alt="Some minichat sticker..." height="50" width="50" style="cursor: pointer;" data-id="${id}"></img>`;
  }
}
