/* import postgres from 'postgres' 

const db = postgres('postgresql://postgres@localhost:5432/postgres')

export default db; */

import { Pool } from "pg";
import { dbConfig } from "../config/DBConfig";

const pool = new Pool(dbConfig);

export default pool;