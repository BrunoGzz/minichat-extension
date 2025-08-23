const maxStickersNum = 20;
const localStickersStorage = "https://api.bruno.com.es/minichat/stickers/"
let stickersNumber = 10;
const addStickerButton = `<form id="uploadSticker" class="d-inline-block" style="margin-left: 4px;" enctype="multipart/form-data">
  <input type="file" name="photo" class="d-none" id="image-file" accept="image/x-png, image/jpeg">
  <label for="image-file" id="addStickerButton" class="stickerImage align-middle">
    <div class="w-100 h-100 m-auto text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-plus h-100" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
    </div>
  </label>
</form>`;

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

        if(result["success"]){
            stickersNumber = data.length;
            document.getElementById("stickersNumber").innerHTML = stickersNumber;

            if(stickersNumber < maxStickersNum){
                data.forEach(sticker => {
                    document.getElementById("stickersContainer").innerHTML += getStickerHTML(sticker.id, sticker.extension, sticker.storage);
                });


                document.getElementById("stickersContainer").innerHTML += addStickerButton;
                var img = document.getElementById("image-file");
                img.addEventListener("change", function (event) {
                    const file = event.target.files[0];
                    if (file) {
                        const fileSizeInKB = Math.round(file.size / 1024);
                        if(fileSizeInKB > 1024){
                            Toastify({
                                text: "Your file size is bigger than 1Mb!",
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
                        }else{
                            // Create a new FormData object
                            const formData = new FormData();
                            formData.append('photo', file); // Add the selected file to FormData
                            formData.append('id', localStorage.getItem("id"));
                            // Create an XMLHttpRequest object
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', 'https://api.bruno.com.es/minichat/addSticker.php', true);
                            xhr.onload = function () {
                                if (xhr.status === 200) {
                                    const response = JSON.parse(xhr.responseText);
                
                                    if(response["status"] != 1){
                                        Toastify({
                                            text: "Internal error :(",
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
                                    }else{
                                        location.reload();
                                    }
                                } else {
                                    Toastify({
                                        text: "Internal error :(",
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
                            };
                        
                            // Send the form data
                            xhr.send(formData);
                        }
                    }else{
                        Toastify({
                            text: "Error getting your image...",
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
            }
        }else{
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
                    background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
                },
                onClick: function(){} // Callback after click
                }).showToast();
        }
    }else{
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
                background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
            },
            onClick: function(){} // Callback after click
            }).showToast();
    }
};
xhr.send(body);

function getStickerHTML(id, extension, storage) {
    let stickerUrl = `${localStickersStorage}${id}.${extension}`;
    
    return `
    <div class="sticker-container">
        <img class="stickerImage" src="${stickerUrl}" alt="Some minichat sticker..." height="50" width="50"></img>
        <div class="delete-icon" data-id="${id}">×</div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', function () {
    // Añadir listener a los botones de eliminar sticker
    document.getElementById("stickersContainer").addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-icon')) {
            let stickerId = event.target.getAttribute('data-id');
            
            // Enviar solicitud POST para eliminar el sticker
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.bruno.com.es/minichat/deleteSticker.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    const response = JSON.parse(xhr.responseText);

                    if (response.status == 1) {
                        event.target.parentElement.remove();  // Eliminar el sticker del DOM
                        stickersNumber--;  // Reducir el contador de stickers
                        document.getElementById("stickersNumber").innerHTML = stickersNumber;
                    } else {
                        Toastify({
                            text: "Error al eliminar el sticker.",
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
                            onClick: function () { }
                        }).showToast();
                    }
                }
            };

            xhr.send(`id=${stickerId}`);
        }
    });
});