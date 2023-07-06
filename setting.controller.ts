import express, { Request, Response, NextFunction } from "express";
import { User } from "./setting";
import { SettingService } from "./setting.service";


export class SettingController {
  constructor(private settingService: SettingService) {}


  get = async (req: Request, res: Response) => {
    let user_id = req.session.user?.id;
    if (!user_id) {
      res.status(400).json({
        error: "User not found",
      });
      return;
    }
    res.json(await this.settingService.get(user_id));
  };

  update = async (req: Request, res: Response) => {
    let user_id = req.session.user?.id;
    const { phone, email } = req.body;
    if ( !phone || !email) {
      res.status(400).json({
        error: "Please input email and phone",
      });
      return;
    }
    // if (typeof phone !== "number") {
    //   res.status(400).json({
    //     error: "Only input of number is allowed",
    //   });
    //   return;
    // }
    res.json(await this.settingService.update({ user_id, phone, email }));
  };

  setWarning = async (req: Request, res: Response) => {
    let user_id = req.session.user?.id;
    const { second } = req.body;
    res.json(await this.settingService.setWarning({ user_id, second }));
  };
}
