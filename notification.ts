import express from 'express'
import { knex } from './db';
// import { client } from './db'
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service'
// import { userGuard } from './guard'
// import { io } from './io'

export let notificationRoutes = express.Router()

// export type User = {
//   id: number
//   username: string
//   email: string
//   phone: string
//   warning_second: number
// }

let notificationService = new NotificationService()
let notificationController = new NotificationController(notificationService)

console.log('test here')

notificationRoutes.get("/getNotification", notificationController.get);
notificationRoutes.post('/newNotification', notificationController.post);
// settingRoutes.put('/setwarntime', settingController.setWarning);