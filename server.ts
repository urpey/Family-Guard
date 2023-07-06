import express from 'express';
import { print } from 'listening-on';
import http from 'http';
import { cyan, reset } from 'asciichart';
import {sessionMiddleware} from "./session";
import { usersRoutes } from './users-Routes';
import { grantMiddleware } from './grant';
import { checkLogin} from './guard';
import { settingRoutes } from './setting';
import { notificationRoutes } from './notification';
// import { dataRoute } from './data';
import { Server as SocketIO } from 'socket.io';
import {attachServer} from './io';


let app = express();
const server = new http.Server(app);
export const io = new SocketIO(server);
import { ioRoute } from './io';
import { actionRoutes } from './actionRoute';
import { cameraRoutes } from './camera-route';
// import { monitorRoutes } from './monitor.Route';
app.use(express.urlencoded())
app.use(express.json())
attachServer(io)
//app.use(express.json());

// io.on('connection', function (socket) {
//   // This socket is the specific socket
//   socket.on("client-to-server",()=>{
//     console.log(
//       "hi"
//     )
//   })
// });

// io.emit("greet","hihi")

app.use(sessionMiddleware)
app.use(grantMiddleware)
app.use(usersRoutes)
app.use(settingRoutes)
app.use(notificationRoutes)
app.use(cameraRoutes)
// app.use(dataRoute)
app.use(ioRoute);
app.use(actionRoutes)
app.use(express.static('users'));
app.use(checkLogin,express.static('public'));
// app.use(express.static('assets'));



function d2(x: number): string {
    if (x < 10) {
      return '0' + x
    }
    return String(x)
  }
  
  app.use((req, res, next) => {
    let date = new Date()
    let y = date.getFullYear()
    let m = d2(date.getMonth() + 1)
    let d = d2(date.getDate())
    let H = d2(date.getHours())
    let M = d2(date.getMinutes())
    let S = d2(date.getSeconds())
  
    console.log(
      `[${cyan}${y}-${m}-${d} ${H}:${M}:${S}${reset}] ${req.method} ${req.url}`,
    )
    next()
  })
let port = 8080
server.listen(port,() => {print(port)})