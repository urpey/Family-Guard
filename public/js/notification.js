let notificationContainer = document.querySelector(".notification-clone");
let messageTemplate = document.querySelector(".message-inner");
let noResult = document.querySelector(".no-notification");
let socket
let user_id = null

let savedPic
let savedMessage

const newKeys = {
  action: "message_id",
  dDate: "date",
  dTime: "time"
};

messageTemplate.remove();


function switchFunc(n) {
  switch (n) {
    case 1:
      savedMessage = "Fall Detected"
      savedPic = "assets/warning.png"
      return
    case 2:
      savedMessage = "Wave Detected"
      savedPic = "assets/2.png"
      return
    case 3:
      savedMessage = "Leave home for 30mins"
      savedPic = "assets/3.png"
      return
    case 4:
      savedMessage = "Visitors detected"
      savedPic = "assets/4.png"
      return
    default:
      savedMessage = "Unknown action"
      savedPic = "#"
      return
  }
}



function connectSocketIO() {
  socket = io.connect()
  console.log('io is connect!')
  socket.on('server-to-client', () => {
    console.log('socket.io connected to server, id:', socket.id)
  })

  socket.on('greet', message => {
    console.log('received greeting from socket.io:', message)
  })

  socket.on('new notification', content => {
    // console.log('received greeting from socket.io:', content)
    console.log("show", content)
    content = renameKeys(content, newKeys);
    console.log(content)
    noResult.style.display = "none";
    showContent(content)
    // showNotification(savedMessage);
  })


  //socket.emit("client-to-server");
}

connectSocketIO()

function reconnectSocketIO() {
  socket.disconnect()
  // connectSocketIO() // don't need to create a new socket object
  socket.connect() // connect from the same socket object can reuse the previously added event listeners
}

fetch("/getNotification")
  .then((res) => res.json())
  .catch((error) => ({
    error: String(error),
  }))
  .then((json) => {
    if (json.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: json.error,
      });
      return;
    }

    if (json.length >= 1) {
      json.forEach((content) => showContent(content));
    } else {
      noResult.style.display = "block";
    }
  });

function showContent(content) {
  let messageContainer = messageTemplate.cloneNode(true);
  switchFunc(content.message_id)
  messageContainer.querySelector(".card-event").textContent = savedMessage;
  messageContainer.querySelector(".card-date").textContent = content.date;
  messageContainer.querySelector(".card-time").textContent = content.time
  messageContainer.querySelector(".warning-png").src = savedPic

  notificationContainer.prepend(messageContainer);

  //   notificationContainer.innerHTML += `
  //   <div class="notification-clone">
  //   <div class="box flex-col">
  //       <div class="notification-img"><img class="warning-png" src="assets/warning.png"></div>
  //       <div><span class="card-event">Fall Warning</span><br>
  //       <div><span class="card-date">${content.date}</span> / <span class="card-time">21:24:31</span></div>
  //   </div>
  // </div>

  //   `
}

function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return {
      [newKey]: obj[key]
    };
  });
  return Object.assign({}, ...keyValues);
}
