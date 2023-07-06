import express, { Request, Response, NextFunction } from "express";
import { User } from "./setting";
import { NotificationService } from "./notification.service";
import { io } from './server'


export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  get = async (req: Request, res: Response) => {
    let user_id = req.session.user?.id;
    if (!user_id) {
      res.status(400).json({
        error: "User not found",
      });
      return;
    }
    res.json(await this.notificationService.get(user_id));
    
  };

  post = async (req: Request, res: Response) => {
    let user_id = req.session.user?.id;
    const { action, dDate, dTime } = req.body;
    // if ( !phone || !email) {
    //   res.status(400).json({
    //     error: "Please input email and phone",
    //   });
    //   return;
    // }
    res.json(await this.notificationService.post({ user_id, action, dDate, dTime }));
    io.to(`room-${req.session.user?.id}`).emit('new notification', { user_id, action, dDate, dTime })
  };


  
}
