import {Server,Socket} from 'socket.io'
import { knex } from "./db";
import http from 'http'
import { Request, Response, NextFunction } from 'express'
import express from 'express';
import { io } from "./server"
import './session'
import { sessionMiddleware } from './session'
//import { Socket } from "socket.io";

export const ioRoute = express.Router();
type DataPack ={
    user_id:number,
    actionArray:Array<number>
}

let dataPack:DataPack = {
    user_id:0,
    actionArray:[]
}
const actionArray:Array<number> = []

let actionNumber

export function attachServer(io:Server) {
    io.use((socket, next) => {
      let req = socket.request as Request
      let res = req.res!
      sessionMiddleware(req, res, next as NextFunction)
    })
    io.emit("server-to-client")

    io.on("client-to-server",()=>{
    console.log('testing')
    })

    io.on('connection', (socket) => {
      let req = socket.request as Request
      let user = req.session.user

      if(user){ // Based on some condition
        socket.join(`room-${req.session.user?.id}`)
        console.log(req.session.user?.id)
    }

      console.log('connection established:', {
        socket_id: socket.id,
        user_id: user?.id,
      })
  
      if (user) {
        socket.emit('greet', `hi ${user.username}, welcome back`)
      }
  
    //   socket.on("Action Number",(json)=>{
    //     dataPack.user_id = json.id
    //     dataPack.actionArray.push(json.action)
    //     console.log(dataPack)
    // })

    socket.on('send action',(data)=>{
      // data has the content {msg:"Hello Client"}
      console.log("showaction",data)
  })

    socket.on('check username',async (json)=>{     
      let username = json.username
      let result:any =await knex.select('username').from('users').where('username', username);
      if (result.length >= 1) {
          io.emit('username used',{msg:'This username has been used. Please try another username.'})
      }else{
          io.emit('username can be used',{msg:'username available'})
      }
    })
    socket.on('check email',async (json)=>{
        let email = json.email
        let result:any =await knex.select('email').from('users').where('email', email);
        if (result.length >= 1 ) {
          io.emit('email used',{msg:'This email has been used. Please try another email.'})
      }else [
          io.emit('email can be used',{msg:'email available'})
      ]
  })

      socket.on('disconnect', () => {
        console.log('connection closed:', {
          socket_id: socket.id,
          user_id: user?.id,
        })
        io.to(`room-${req.session.user?.id}`).emit('noresult', 0)
      })
    })
  }

  
