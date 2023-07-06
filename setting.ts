import express from 'express'
import { knex } from './db';
// import { client } from './db'
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service'
// import { userGuard } from './guard'
// import { io } from './io'

export let settingRoutes = express.Router()

export type User = {
  id: number
  username: string
  email: string
  phone: string
  warning_second: number
}

let settingService = new SettingService()
let settingController = new SettingController(settingService)



settingRoutes.get("/getinfo", settingController.get);
settingRoutes.put('/updateinfo', settingController.update);
settingRoutes.put('/setwarntime', settingController.setWarning);