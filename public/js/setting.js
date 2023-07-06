let option0 = document.querySelector('.option-0')
// let option5 = document.querySelector('.option-5')
// let option10 = document.querySelector('.option-10')
// let option20 = document.querySelector('.option-20')
let option
let id
let notifyButton = document.querySelector('.notification-on')


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

// 3. update warning_second
async function setWarningTime(event, second) {
  console.log(event.target, second)

  // event.preventDefault();
  const res = await fetch("/setwarntime", {
    method: "PUT",
    headers:{
      "content-type":"application/json"
    },
    body:JSON.stringify({second}),
  });
  const result = await res.json();
  if (result.error) {
    return
  }
  let originOption = document.querySelector(`.option-${option}`)
  originOption.classList.replace("color-orange", "color-blue")
  let newOption = document.querySelector(`.option-${second}`)
  newOption.classList.replace("color-blue", "color-orange")
  option = second
}


// 1. fetch username, mobile, email and warning_second

fetch("/getinfo")
  .then((res) => res.json())
  .catch((err) => ({
    error: String(err),
  }))
  .then((json) => {
    if (json.error) {
        sweetAlertError(json.error);
        setTimeout(function () {
          // window.location = './login.html'
        }, 10000)
      return;
    }
    console.log(json)

    // let info = {username: "DEF", email: "abc@gmail.com", phone: "12345678", warning: "10"}

    // document.querySelector(".post-id").textContent = "#" + id;
    document.querySelector(".username").innerText = json.username;
    document.querySelector(".email").value = json.email;
    document.querySelector(".phone").value = json.phone;
    id = json.id
    // });
    option = json.warning_second
    let selectedOption = document.querySelector(`.option-${option}`)
    selectedOption.classList.replace("color-blue", "color-orange")
  })


// 2. update phone and email
function updateInfo(event) {
  event.preventDefault();
  let form = event.target;
  const formObject = {};

  formObject["phone"] = form.phone.value;
  formObject["email"] = form.email.value;

  fetch("/updateinfo", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
    .then((res) => res.json())
    .catch((error) => ({
      error: String(error),
    }))
    .then((json) => {
      if (json.error) {
        sweetAlertError(json.error);
        setTimeout(function () {
          // window.location = './'
        }, 1000)
        return;
      } else {
        console.log(json);
        sweetAlertSuccess("Info changed");
        setTimeout(function () {
          window.location = "./setting.html";
        }, 1000);
      }
    });
}

function sweetAlertError(message) {
  Swal.fire({
    icon: 'error',
    title: '發生錯誤！',
    timer: 20000,
    text: message,
  })
}

function sweetAlertSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 10000
  })
}