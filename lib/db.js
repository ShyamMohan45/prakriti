import mysql from "mysql2/promise"

let pool = null

export function getDbPool() {
  if (!pool) {
    let rawHost = (process.env.DATABASE_HOST || process.env.MYSQLHOST || "localhost").trim().replace(/[\r\n\s]+/g, "")
    // Auto-fix accidental duplicate pasting in Vercel environment UI
    if (rawHost.includes("tidbcloud.com")) {
      const match = rawHost.match(/[a-zA-Z0-9.-]*tidbcloud\.com/)
      if (match) {
        rawHost = match[0]
      }
      if (rawHost.includes("gateway01.ap-southgateway01")) {
        rawHost = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
      }
    }
    const host = rawHost

    let user = (process.env.DATABASE_USER || process.env.MYSQLUSER || "3AwdXpFU16w4FiC.root").trim().replace(/[\r\n\s]+/g, "")
    if ((user === "root" || !user.includes(".")) && host.includes("tidbcloud.com")) {
      user = "3AwdXpFU16w4FiC.root"
    }
    const password = (
      process.env.DATABASE_PASS ||
      process.env.DATABASE_PASSWORD ||
      process.env.MYSQLPASSWORD ||
      "password"
    ).trim()
    const database = (
      process.env.DATABASE_NAME || process.env.MYSQLDATABASE || "test"
    ).trim().replace(/[\r\n\s]+/g, "")
    const port =
      Number(String(process.env.DATABASE_PORT || process.env.MYSQLPORT).trim()) || 3306

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
      ssl:
        process.env.DATABASE_SSL === "true" || port === 4000
          ? {
              minVersion: "TLSv1.2",
              rejectUnauthorized: false,
            }
          : undefined,
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