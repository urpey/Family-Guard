let pw1 = document.querySelector('[name="password1"]')
let pw2 = document.querySelector('[name="password2"]')
let pw1reminder = document.querySelector('[name="password1-reminder"]')
let pw2reminder = document.querySelector('[name="password2-reminder"]')
let username = document.querySelector('[name="username"]')
let email = document.querySelector('[name="email"]')
let usernameReminder = document.querySelector('[name="username-reminder"]')
let emailReminder = document.querySelector('[name="email-reminder"]')
let socket = io.connect();
let eye1 = document.querySelector('#eye1')
let eye2 = document.querySelector('#eye2')

socket.on('connect', () => {
    console.log('socket.io connected to server, id:', socket.id)
})

function checkPW() {
    if (pw1.value.length < 1) {
        return
    }
    else if (pw2.value.length < 1) {
        return
    }
    else if (pw1.value == pw2.value) {
        pw1reminder.textContent = ''
        pw2reminder.textContent = ''
    }
    else if (pw1.value != pw2.value) {
        pw1reminder.textContent = 'password mismatch'
        pw2reminder.textContent = 'password mismatch'
    }
}
eye1.addEventListener('click',()=>{
    const type = pw1.getAttribute("type") === "password" ? "text" : "password";
    pw1.setAttribute("type", type);
    const icon = eye1.getAttribute('class') === "bi bi-eye-fill" ? "bi bi-eye-slash-fill" : "bi bi-eye-fill";
    eye1.setAttribute('class',icon);
})

eye2.addEventListener('click',()=>{
    const type = pw2.getAttribute("type") === "password" ? "text" : "password";
    pw2.setAttribute("type", type);
    const icon = eye2.getAttribute('class') === "bi bi-eye-fill" ? "bi bi-eye-slash-fill" : "bi bi-eye-fill";
    eye2.setAttribute('class',icon);
})

pw1.addEventListener('input',()=>{
    eye1.classList.remove('none')
    checkPW()
} )
pw2.addEventListener('input', ()=>{
    eye2.classList.remove('none')
    checkPW()
} )
username.addEventListener('input', () => { socket.emit('check username', { username: username.value }) })
email.addEventListener('input', () => { socket.emit('check email', { email: email.value }) })

socket.on('username used', (json) => {
    usernameReminder.classList.remove('safe')
    usernameReminder.textContent = json.msg
})
socket.on('email used', (json) => {
    emailReminder.classList.remove('safe')
    emailReminder.textContent = json.msg
})

socket.on('username can be used', (json) => {
    usernameReminder.classList.add('safe')
    usernameReminder.textContent = json.msg
})

socket.on('email can be used', (json) => {
    emailReminder.classList.add('safe')
    emailReminder.textContent = json.msg
})

