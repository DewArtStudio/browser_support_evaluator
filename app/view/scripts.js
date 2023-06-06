const sendUrl = document.getElementById("url");
const url = "http://localhost/browser_evaluator";
function send() {
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: sendUrl.value }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });
}
