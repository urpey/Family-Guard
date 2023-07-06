let notifyButton = document.querySelector('.notify')
let testBtn = document.querySelector('.test')

console.log(Notification.permission)

function showNotification() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("Hiiiiiiii", {
            body: "Welcome!"});
      }
    // const notification = new Notification("New message", {
    //     body: "Welcome!"
    // })
}

notifyButton.addEventListener('click', function () {
    // If the user agreed to get notified
    if (Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        })
    }
})


testBtn.addEventListener('click', function () {
 
        showNotification();
    
})
socket = io.connect()
// socket.on("client-to-server");