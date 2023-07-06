let fallWarning = document.querySelector(".warning-time")
let username = document.querySelector(".session-username")
let connectStatus = document.querySelector(".c-status")
let leftWindow = document.querySelector(".left-window")

let actionNumber = 99
let warningtext
let warningpic


function connectSocketIO() {
    socket = io.connect()

    socket.on('actionnumber', content => {
        // console.log('received greeting from socket.io:', content)
        console.log("actionnumber", content)
        changeNotification(content)
        //   content = renameKeys(content, newKeys);
        //   console.log(content)
        //   noResult.style.display = "none";
        //   showContent(content)
        //   showNotification(savedMessage);
    })

    socket.on('noresult', content => {
        // console.log('received greeting from socket.io:', content)
        console.log("noresult", content)
        document.querySelector(".warning-text").textContent = "Camera not active now"
        document.querySelector(".warning-pic").src = "assets/Error.png"
        connectStatus.textContent = "● No connection"
        connectStatus.classList.remove('connect-status');
        connectStatus.classList.add('disconnect-status');
        changeWhite()
    })
    //socket.emit("client-to-server");
}

connectSocketIO()


function changeNotification(content) {
    document.querySelector(".c-status").textContent = "● Connected"
    connectStatus.classList.remove('disconnect-status');
    connectStatus.classList.add('connect-status');
    if (content != actionNumber) {
        switch (content) {
            case 0:
            case 1:
            case 2:
                document.querySelector(".warning-text").textContent = "Safe"
                document.querySelector(".warning-pic").src = "assets/safe.png"
                changeGreen()
                return
            case 3:
                document.querySelector(".warning-text").textContent = "Wave Detected"
                document.querySelector(".warning-pic").src = "assets/2.png"
                changeRed()
                return
            case 4:
                document.querySelector(".warning-text").textContent = "Fall Detected"
                document.querySelector(".warning-pic").src = "assets/warning.png"
                changeRed()
                return
            case 5:
                document.querySelector(".warning-text").textContent = "No one at home now"
                document.querySelector(".warning-pic").src = "assets/3.png"
                changeWhite()
                return
            case 6:
                document.querySelector(".warning-text").textContent = "Visitors detected"
                document.querySelector(".warning-pic").src = "assets/4.png"
                changeWhite()
                return
            default:
                document.querySelector(".warning-text").textContent = "Camera not active now"
                document.querySelector(".warning-pic").src = "assets/Error.png"
                changeWhite()
                return
        }
    }
    actionNumber = content
}


function changeGreen(){
    leftWindow.classList.remove('white-bg');
    leftWindow.classList.remove('red-bg');
    leftWindow.classList.add('green-bg');
}

function changeRed(){
    leftWindow.classList.remove('white-bg');
    leftWindow.classList.add('red-bg');
    leftWindow.classList.remove('green-bg');
}

function changeWhite(){
    leftWindow.classList.add('white-bg');
    leftWindow.classList.remove('red-bg');
    leftWindow.classList.remove('green-bg');
}

function updateClock() {
    time = moment().format('HH:mm')
    date = moment().format('YYYY/MM/D')

    // set the content of the element with the ID time to the formatted string
    document.getElementById('date').innerHTML = date;
    document.getElementById('time').innerHTML = time;

    // call this function again in 1000ms
    setTimeout(updateClock, 1000);
}
updateClock(); // initial call


fetch("/getinfo")
    .then((res) => res.json())
    .catch((err) => ({
        error: String(err),
    }))
    .then((json) => {
        if (json.error) {
            console.log(json.error);
            return;
        }
        username.innerText = json.username
        if (json.warning_second == 0) {
            fallWarning.innerText = "Disabled"
        } else {
            fallWarning.innerText = json.warning_second + "sec"
        }
    })