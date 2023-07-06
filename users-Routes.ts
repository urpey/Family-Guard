import express from 'express';
import {UsersController} from './users-controller';
import {UsersService} from './users-service';

const usersService = new UsersService;

export let usersRoutes = express.Router()
let userscontroller = new UsersController(usersService)
    usersRoutes.post('/login',userscontroller.login)
    usersRoutes.post('/register',userscontroller.register)
    usersRoutes.get('/login/google',userscontroller.loginViaGoogle)
    usersRoutes.get('/logout',userscontroller.logout)
    usersRoutes.get('/userdata',userscontroller.getSessionUser)
 