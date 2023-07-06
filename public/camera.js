

// Countdown

setInterval(()=>{

},5000)

function sendData() {
    fetch('/sendData', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataArr),
    }).then((res)=>{
        return res.json()    
    }).then(data=>{
        console.log(data)
    })
}

    
let timeLeft = 5;
let elem = document.getElementById('count-down');
    
let timerId = setInterval(countdown, 1000);
    
    function countdown() {
      if (timeLeft == -1) {
        clearTimeout(timerId);
      } else {
        elem.innerHTML = timeLeft;
        timeLeft--;
      }
    }



//settimeout
const asyncTimeout = async (m) => {
  return new Promise((resolve) => setTimeout(resolve, m));
};



// webCam
const video = document.querySelector("video");

// webCam display
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

var constraints = (window.constraints = {
  audio: false,
  video: {
    width: 360,
    height: 270,
  },
});

let dataArr = [];

function printArr() {
  console.log(dataArr);
}

getMedia(constraints);

async function getMedia(constraints) {
  let stream = null;

  let res = await navigator.mediaDevices.enumerateDevices();
  console.log(res);

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);

    window.stream = stream;
    video.srcObject = stream;
  } catch (err) {
    Swal.fire({
      title: "Error",
      html: "you need to open your webcam to active it",
      timerProgressBar: true,
      allowEscapeKey: false,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    console.log(err);
  }
}

async function loadModelTF() {
  //SINGLEPOSE_LIGHTNING = faster , SINGLEPOSE_THUNDER = acc up
  model = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
  );

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  Swal.close();

  predictModel();

  return;
}

async function predictModel() {
  const poses = await model.estimatePoses(video);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

  if (poses.length >= 1) {
    for (const pt of poses) {
      pt.keypoints != null && drawKeypoint(pt.keypoints);

        //  dataArr.push(pt)
        //  if(dataArr.length == 10) {
        //     sendData()
        //     canvas.remove()
        //     return false
        //  }
    }

    function drawKeypoint(keypoint) {
      for (let pt of keypoint) {
        if (pt.score > 0.2) {
          ctx.beginPath();

          if (pt.name == "left_wrist") {
            ctx.fillStyle = "blue";
            ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI, false);
          } else if (pt.name == "right_wrist") {
            ctx.fillStyle = "red";
            ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI, false);
          } else {
            ctx.fillStyle = "white";
            ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI, false);
          }

          ctx.fill();
        }
      }
    }
  } else {
    console.log("nope");
    //init();
  }

  window.requestAnimationFrame(predictModel);
}

video.addEventListener("loadeddata", async (event) => {
  console.log("Camera loading success yeah!");
    await asyncTimeout(5000);
    loadModelTF();

  // Swal.fire({
  //   title: "Model loading...",
  //   html: "Waiting for model load in, please wait.",
  //   timerProgressBar: true,
  //   allowEscapeKey: false,
  //   showCloseButton: false,
  //   showCancelButton: false,
  //   showConfirmButton: false,
  //   allowOutsideClick: false,
  //   didOpen: () => {
  //     Swal.showLoading();
  //   },
  // });
});

// setTimeout(() => {
//     video.
// },100000)