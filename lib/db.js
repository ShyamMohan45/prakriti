import mysql from "mysql2/promise"

let pool = null

export function getDbPool() {
  if (!pool) {
    const host = process.env.DATABASE_HOST || process.env.MYSQLHOST || "localhost"
    const user = process.env.DATABASE_USER || process.env.MYSQLUSER || "root"
    const password =
      process.env.DATABASE_PASS ||
      process.env.DATABASE_PASSWORD ||
      process.env.MYSQLPASSWORD ||
      "password"
    const database =
      process.env.DATABASE_NAME || process.env.MYSQLDATABASE || "dxassist"
    const port =
      Number(process.env.DATABASE_PORT || process.env.MYSQLPORT) || 3306

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
    })
  }
  return pool
}

// Proxies both function calls `const pool = getPool()` and direct property calls `await getPool.query(...)`
export const getPool = new Proxy(getDbPool, {
  apply(target, thisArg, argArray) {
    return getDbPool()
  },
  get(target, prop) {
    const p = getDbPool()
    const val = p[prop]
    if (typeof val === "function") {
      return val.bind(p)
    }
    return val
  },
})

export default getPool