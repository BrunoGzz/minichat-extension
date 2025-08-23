console.log('%cWARNING!', 'font-size: 24px; color: red; background: yellow; padding: 10px; border: 2px solid black;');
console.log('%cDo not copy or paste anything here. Your data could be stolen.', 'font-size: 18px; color: red;');

if(!localStorage.getItem("id")){
    const createHtml = document.createElement('div');
    createHtml.innerHTML = '<iframe src="create.html" style="height: 100vh;"></iframe>';
    document.body.appendChild(createHtml);
}else{
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.bruno.com.es/minichat/validate.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body = JSON.stringify({
        id: localStorage.getItem("id"),
    });
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = JSON.parse(xhr.responseText);
            if(result['success']==false){
                Toastify({
                    text: "Verification error.",
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
                localStorage.clear();
                const createHtml = document.createElement('div');
                createHtml.innerHTML = '<iframe src="./create.html" style="height: 100vh;"></iframe>';
                document.body.appendChild(createHtml);
            }else if(result['success']==true){
                const createHtml = document.createElement('div');
                createHtml.innerHTML = '<iframe src="./chats.html" style="height: 100vh;"></iframe>';
                document.body.appendChild(createHtml);
            }
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send(body);
}

document.getElementById("vote-stars").style["display"] = "none";

if(localStorage.getItem("stopSpamming") == null){
    const randomNumber = Math.floor(Math.random() * 75); // Genera un número aleatorio entre 0 y 75
    if (randomNumber === 1) { // Ejecuta el código cuando el número aleatorio es igual a 1
        document.getElementById("vote-stars").style["display"] = "inline-block";
    }
}

document.getElementById("close-vote-button").addEventListener("click", function() {
    document.getElementById("vote-stars").style["display"] = "none";
});

document.getElementById("close-vote-button-always").addEventListener("click", function() {
    document.getElementById("vote-stars").style["display"] = "none";
    localStorage.setItem("stopSpamming", true);
});