import expressSession from 'express-session'
import { GrantSession } from 'grant'
import './db'

declare module 'express-session' {
  interface SessionData {
    counter?: number
    user?: {
      id: number
      username: string
    }
    grant?: GrantSession
  }
}

export let sessionMiddleware = expressSession({
  
    secret: 'badproject',
    resave: true,
    saveUninitialized: true,
  })