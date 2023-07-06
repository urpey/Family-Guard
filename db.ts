
import dotenv from 'dotenv';
dotenv.config();
import Knex from "knex";

const knexConfig = require("./knexfile");


// console.log(process.env.DATA_ENV)
export const knex = Knex(knexConfig[process.env.DATA_ENV || "test"  ]);