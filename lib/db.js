import mysql from "mysql2/promise"

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password", // put your mysql password here
  database: "dxassist",
})