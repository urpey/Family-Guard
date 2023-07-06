
import {UsersController} from './users-controller';
import {Request, Response, NextFunction} from 'express';
import {UsersService} from './users-service';


//jest.mock('./users-service');

describe('userscontroller test', ()=>{
  let req: Request;
  let res: Response;
  let usersService:UsersService;
  let userscontroller:UsersController;
  let recaptchaResult:any;

  describe('Login', ()=>{
    beforeEach(()=>{
      usersService = new UsersService();
      userscontroller = new UsersController(usersService);
      req = {
        body:{},
        session:{
          user:{}
        },
      } as any;
      res ={
        redirect:jest.fn(),
      } as any
      res.status = jest.fn(()=>{return res})
      res.json = jest.fn()
      res.send=jest.fn()
      recaptchaResult={success:true}
      // usersService.Login = jest.fn(async ()=>{
      //   return [{
      //     id: 1,
      //     username: 'admin'}]
      // });
      
    });
  
    
    it('login success with correct info', async ()=>{
      const spy = jest.spyOn(usersService,'Login').mockImplementation(async()=>{
        return Promise.resolve([{
          id:1,
          username:"admin"
        }])
      });

      req.body = {
        username: 'admin',
        password: 'admin',
      };

      await userscontroller.login(req, res);
      expect(spy).toBeCalled()
      expect(res.json).toBeCalledWith({msg:'login success'})
      expect(req.session.user).toEqual({
        id: 1,
        username: 'admin',
      });
    });

    it('Login fail with wrong info',async ()=>{
      const spy2 = jest.spyOn(usersService,'Login').mockImplementation(async()=>{return Promise.resolve([])});

      req.body = {
        username: 'a',
        password: 'a',
      };
      await userscontroller.login(req, res);
      expect(spy2).toBeCalled()
      expect(res.json).toBeCalledWith({error: 'wrong username or password'})
    })
  });

  // it('Register',async ()=>{
  //   const spy3 = jest.spyOn(usersService,'Register').mockImplementation(async()=>{return Promise.resolve([{
  //     id:3,
  //     username:"admin3"
  //   }])});
  //   req.body = {
  //     username: 'admin3',
  //     password1: 'admin3',
  //     password2: 'admin3',
  //     email: 'admin3@admin3.io',
  //     phone: "12341234",
  //   };
    
  //   await userscontroller.register(req,res)
  //   expect(spy3).toBeCalled()
  //   expect(req.session.user).toEqual({
  //     id: 3,
  //     username: 'admin3',
  //   });
  // })

});

