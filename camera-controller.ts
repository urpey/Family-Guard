import { Request, Response, NextFunction } from "express";
import { CameraService } from "./camera-service";
import { io } from "./server";

// type DataPack = {
//   user_id: number;
//   actionArray: Array<number>;
// };
// let dataPack: DataPack = {
//   user_id: 1,
//   actionArray: [],
// };

// let arraySum = 0;

export class CameraController {
  constructor(private cameraService: CameraService) {}

  storeDataAfterOneHour = async (req: Request, res: Response) => {
    const { id, action } = req.body;
    console.log("camera-controller.ts --- sendFromFontend   "  +  req.body.action)
    io.to(`room-${req.session.user?.id}`).emit("actionnumber", req.body.action);
    res.json({ action });
    await this.cameraService.dataAnalysis(id,action)
  };
}
