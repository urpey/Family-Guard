import {Request, Response, NextFunction} from 'express';
import './session';
import {sessionUserData, UsersService} from './users-service';
import {knex} from './db';
import fetch from 'cross-fetch';
import { io } from './server';
import { createBrotliCompress } from 'zlib';
import { createLessThan } from 'typescript';

export type users = {
    id?:number,
    username?: string,
    password?: string,
    email?: string,
    phone?: number,
    warning_second?: number,
    camera?: string,
}
export type registerForm ={
    username:string,
    password:string,
    email:string,
    phone:string,
}

export class UsersController {
  constructor(
        private usersService: UsersService,
  ) {}

  login = async (req:Request, res: Response) => {
    const {username, password} = req.body;
    if (!username) {
      res.status(400).json({error: 'missing username'});
      return;
    }
    if (!password) {
      res.status(400).json({error: 'missing password'});
      return;
    }
    
    
   
    const result = await this.usersService.Login(username, password);
    if(result){
    if (result.length < 1) { 
      res.status(403).json({error: 'wrong username or password'});      
      // res.redirect('login.html')
      return
    } 
      req.session.user = {
        id: result[0].id,
        username: result[0].username,
      };
      res.json({msg:'login success'})
      // res.redirect('/');
    
  }

  };

  register = async (req:Request, res: Response) => {

    // let {username:username,password1,password2,email,phone}= req.body
    for (const body in req.body) {
      if (!body) {
        res.status(400).json({error: `missing ${body}`});
        return;
      }
    }

    
    const resKey = req.body['g-recaptcha-response']
    const secretKey = '6LdMS2cgAAAAALJIb8R6juVouT4KuoYIe6h7afty'
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    const recaptcha = await fetch(url,{method:'POST'})
   let recaptchaResult:any = await  recaptcha.json()


   if(recaptchaResult.success === true) {
    
    const registerForm:registerForm = {
      username: req.body.username,
      password: req.body.password1,
      email: req.body.email,
      phone: req.body.phone,
    };
    
    
    const result = await this.usersService.Register(registerForm);
    if(result){
      req.session.user = {
        id: result[0].id,
        username: result[0].username,
      };
    return res.redirect('/');
    }
  } else {
    return res.redirect('/register.html')
  }
  };

  loginViaGoogle = async (req: Request, res: Response) => {
    if (req.session.grant && req.session.grant.response) {
      const accessToken = req.session.grant.response.access_token;

      const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const result = await fetchRes.json();
      const user:any =await this.usersService.LoginViaGoogle(result);
      req.session.user = {
        id: user.id,
        username: user.username,
      };
      res.redirect('/');
    }
  };

  logout = (req: Request, res: Response)=>{
    if (req.session.user) {
      req.session.destroy((err) => {
        console.log(err);
        res.json({msg: 'logout success'});
      });
    }
  };

  getSessionUser = (req: Request, res: Response)=>{ 
    if(req.session.user) {    
      res.json({id:req.session.user.id})
    }
  }

}


