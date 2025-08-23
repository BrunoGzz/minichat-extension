const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.bruno.com.es/minichat/getNews.php", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        let result = xhr.responseText;
        if(result.trim() != ""){
            document.getElementById("communityContainer").innerHTML = result;
        }
    }
};
xhr.send();