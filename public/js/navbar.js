let navInner = document.querySelector(".nav-inner")
let innerCode = `<nav class="aa-nav">
<div class="aa-nav-icon-container">
    <a href="index.html"><img class="fall-guys" src="assets/logo11.png"></a>
</div>
<div class="aa-nav-items">
    <span class="aa-nav-item"><a href="chart.html">Chart</a></span>
    <span class="aa-nav-item"><a href="notification.html">Notification</a></span>
    <span class="aa-nav-item"><a href="setting.html">Setting</a></span>
    <span class="aa-nav-item"><a href="login.html"><button class="btn-hover color-1" name="LogoutBtn-win"><span class="gradient-color">Logout</span></button></a></span>
    <!--     <li id="searchBtn"><a><i class="search fa fa-search"></i></a></li> -->
    <!--     <li id="searchBtn"><a><i class="search fa fa-times hide"></i></a></li> -->
</div>
</nav>

<div class="aa-hamburger-menu collapsed" id="hamburgerMenu" onclick="toggleMenu()">
<span class="aa-icon-bar"></span>
<span class="aa-icon-bar"></span>
<span class="aa-icon-bar"></span>
</div>

<div class="aa-mobile-overlay">
<ul class="aa-mobile-nav-items">
<img class="icon-img" src="assets/ppl.png">
    <li class="user-col">Welcome back<br><span class="session-userinfo">Username</span></li>
    <li><a href="chart.html">Chart</a></li>
    <li><a href="notification.html">Notification</a></li>
    <li><a href="setting.html">Setting</a></li>
    <li><a href="login.html"><button class="btn-hover color-1" name="LogoutBtn-and"><span class="gradient-color">Logout</span></button></a></li>
</ul>
</div>`



fetch("/getinfo")
  .then((res) => res.json())
  .catch((err) => ({
    error: String(err),
  }))
  .then((json) => {
    if (json.error) {
        sweetAlertError("Please login first");
        setTimeout(function () {
          window.location = './login.html'
        }, 1000)
      return;
    }
    console.log(json)

    // let info = {username: "DEF", email: "abc@gmail.com", phone: "12345678", warning: "10"}

    // document.querySelector(".post-id").textContent = "#" + id;
    document.querySelector(".session-userinfo").innerHTML = json.username;
  })


navInner.innerHTML = innerCode

function toggleMenu() {
    $("#hamburgerMenu").toggleClass("collapsed");  
    $(".aa-mobile-overlay").animate({
          height: "toggle",
          opacity: "toggle"
      }, 300);
  }
  
  var navHeight = 90;
  var scrollNavHeight = 65;
  var isExpanded = true;
  
  $(window).scroll(function() {
    if ($(window).scrollTop() > navHeight) {
      $('.aa-nav').addClass('aa-small-nav');    
      $('.aa-nav-icon').addClass('aa-small-nav-icon');
      $('.aa-nav-items').addClass('aa-small-nav-items');
      $('.aa-hamburger-menu').addClass('aa-small-hamburger-menu');
      $('.aa-nav-item > a').css('color', 'black');
      isExpanded = false;
    }
    
    if (!isExpanded && $(window).scrollTop() < navHeight) {
      $('.aa-nav').removeClass('aa-small-nav');    
      $('.aa-nav-icon').removeClass('aa-small-nav-icon');
      $('.aa-nav-items').removeClass('aa-small-nav-items');
      $('.aa-hamburger-menu').removeClass('aa-small-hamburger-menu');
      $('.aa-nav-item > a').css('color', 'black');
      isExpanded = true;
    }
    
  });
  
  // $('#searchBtn').click(function() {
  //   $('.nav-item').toggle();
  //   $('.search').toggleClass('hide');
  // });
  
  // $(document).scroll(function () {
  //   var $nav = $(".navbar-fixed-top");
  //   $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  // });
  


  // Code by Tommy
  let LogoutBtnWin = document.querySelector('[name="LogoutBtn-win"]')
  LogoutBtnWin.addEventListener('click', LogoutFunction)
  let LogoutBtnAnd = document.querySelector('[name="LogoutBtn-and"]')
  LogoutBtnAnd.addEventListener('click', LogoutFunction)

  function LogoutFunction(event){
    event.preventDefault()
    fetch('/logout').then(
      res => {
        console.log(res);
        return res.json()
      }).then(json=>{

      if(json.msg == 'logout success'){
        window.location.replace('/login.html').catch(err=>alert(err))
      }
    })
  }

  function sweetAlertError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      timer: 2000,
      text: message,
    })
  }

  function showNotification(message) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      }
      else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification("New Action From Camera", {
            body: message});
      }
    // const notification = new Notification("New message", {
    //     body: "Welcome!"
    // })
  }

  function connectSocketIO() {
    socket = io.connect()
  
    socket.on('new notification', content => {
      // console.log('received greeting from socket.io:', content)
      switch (content.action) {
        case 1:
          showNotification("Fall Detected");
          return
        case 2:
          showNotification("Wave Detected");
          return
        case 3:
          showNotification("No one at home for 30 minutes");
          return
        case 4:
          showNotification("Visitors detected");
          return
        default:
          showNotification("Unknown action");
          return
      }
    })
  
  }

  connectSocketIO()