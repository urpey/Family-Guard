import { Request, Response, NextFunction } from 'express'

export let checkLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user?.username) {
    next()
  } else {
    res.redirect('login.html')
  }
}

// export let loginRegisterCheck = (req: Request, res: Response, next: NextFunction)=>{
//   if (req.session.user) {
//     res.redirect('/')  
//   } else {
//     next()
//   }
// }
