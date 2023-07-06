import { io } from './server'
import express from "express";
export const dataRoute = express.Router();
import { knex } from "./db";

type DataPack ={
  user_id:number,
  actionArray:Array<number>
}

let arraySum = 0
let dataPack:DataPack = {
  user_id:0,
  actionArray:[]
}
const actionArray:Array<number> = []

dataRoute.post("/action", (req, res) => {
  const { id ,action } = req.body
    dataPack.user_id = id
    dataPack.actionArray.push(action)
  console.log("sendFromFontend   "  +  req.body.action)
  io.to(`room-${req.session.user?.id}`).emit('actionnumber', req.body.action)
  
  res.json({ action })
  
  let array = dataPack.actionArray
  let result = array.reduce((acc, action)=>{
    acc[action] += 1
    return acc
},[0,0,0,0,0,0,0])
  
  arraySum +=result.length
  console.log(arraySum);
  
if(arraySum == 5024) {
  console.log(result)
  insertToDataBase(result)
  dataPack.actionArray = []
  arraySum = 0
}
  }
);


// function calculateDataPack(){
//   let array = dataPack.actionArray
//     let result = array.reduce((acc, action)=>{
//       acc[action] += 1
//       return acc
//   },[0,0,0,0,0,0,0])
//   console.log(result)
//   dataPack.actionArray = []
// }

async function insertToDataBase(result:number[]){
  await knex
      .insert([
        {
            user_id: dataPack.user_id,
            0: result[0],
            1: result[1],
            2: result[2],
            3: result[3],
            4: result[4],
            5: result[5],
            6: result[6],
            created_at: new Date(),
            updated_at: new Date(),
        },
      ])
      .into("action")
}