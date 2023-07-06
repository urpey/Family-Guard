import express from 'express';
import {CameraController} from './camera-controller';
import {CameraService} from './camera-service';




export const cameraRoutes = express.Router()
let cameraService = new CameraService;
let cameraController = new CameraController(cameraService)


cameraRoutes.post('/action',cameraController.storeDataAfterOneHour)

