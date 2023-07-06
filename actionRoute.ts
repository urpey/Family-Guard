import { create } from 'domain';
import express from 'express'
import { knex } from './db';

export const actionRoutes = express.Router()

//pull data from DB

// [
//   {
//     password_hash: '$2a$10$jVieSYQP8GIy85.nd4ZvfOjXTXcCZO1Wf78ohY0yl5GY7guWqSZBW'
//   }
// ]
actionRoutes.get(`/actions`, async (req, res) => {
    let userId = req.session.user?.id
    let result = await knex.select('user_id',"0", "1", "2", "3", "4", "5","6","created_at")
                .from("action")
                .andWhere('user_id',userId)
                .andWhere('created_at','<=', knex.raw(`now() - (?*'1 HOUR'::INTERVAL)`, [1]))
    res.json(result)
})


