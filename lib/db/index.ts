import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";
import * as schema from "./schema";
import isEmpty from "just-is-empty";

const {
  DB_NAME,
  DB_PORT,
  DB_USER_NAME,
  DB_USER_PASS,
  DB_SSL_CONFIG,
  DB_HOST,
  DATABASE_URL,
} = process.env;
export const dbDetails = {
  DB_NAME,
  DB_PORT,
  DB_USER_NAME,
  DB_SSL_CONFIG,
  DB_USER_PASS,
  DB_HOST,
};

export const connectionUri = isEmpty(DATABASE_URL)
  ? `mysql://${DB_USER_NAME}:${DB_USER_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?ssl=${DB_SSL_CONFIG}`
  : (`${DATABASE_URL}?ssl={"rejectUnauthorized":true}` as string);
const poolConnection = mysql2.createPool(connectionUri);
export const db = drizzle(poolConnection, { mode: "planetscale", schema });
