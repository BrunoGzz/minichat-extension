function verificarMensajesNuevos() {
    var lastTime;
    var receiver;
    chrome.storage.sync.get(["lastTime","id"], function(data) {
        lastTime = data["lastTime"];
        receiver = data["id"];
        fetch('https://api.bruno.com.es/minichat/notifications.php', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({time: data["lastTime"], id: data["id"] }),
        })
        .then(response => response.json())
        .then(data => {
        if (Number(data.newMessages) > 0) {
            chrome.action.setBadgeText({ text: data.newMessages.toString() });
            chrome.action.setBadgeBackgroundColor({ color: "red" });
            chrome.action.setBadgeTextColor({ color: "white" });
        } else {
            chrome.action.setBadgeText({ text: '' }); // Elimina el badge si no hay nuevos mensajes
        }
        });
    });
}
  
setInterval(verificarMensajesNuevos, 15000);

verificarMensajesNuevos();
