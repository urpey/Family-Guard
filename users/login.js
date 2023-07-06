let socket = io.connect();
let wrongpwReminder = document.querySelector('[name="wrongpw-reminder"]')
let loginForm = document.querySelector('#login-form')
let pw = document.querySelector('[name="password"]')
let eye = document.querySelector('#eye')


socket.on('connect', () => {
    console.log('socket.io connected to server, id:', socket.id)
})

loginForm.addEventListener('submit',async (event)=>{
event.preventDefault()
const form = event.target;
const body = {
    username: form.username.value,
    password: form.password.value,
}
    fetch('login',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)})
        .then(res=>res.json())
        .then(json=>{
            console.log(json);
            if(json.msg){
                window.location.replace('index.html')
            }
            else if(json.error){
                form.reset()
                wrongpwReminder.textContent = json.error
            }
            }
        )
        .catch(err=>{console.log(err);})
})


eye.addEventListener('click',()=>{
    const type = pw.getAttribute("type") === "password" ? "text" : "password";
    pw.setAttribute("type", type);
    const icon = eye.getAttribute('class') === "bi bi-eye-fill" ? "bi bi-eye-slash-fill" : "bi bi-eye-fill";
    eye.setAttribute('class',icon);
})

pw.addEventListener('input',()=>{
    eye.classList.remove('none')
} )