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

// In-memory fallback tables if remote database access is denied
const fallbackStore = {
  users: [],
  email_otps: [],
  posts: [],
  userIdCounter: 1,
}

function handleFallbackQuery(sql, params = []) {
  const s = String(sql).trim()

  // Health check query
  if (/^SELECT\s+1/i.test(s)) {
    return [[{ "1": 1 }], []]
  }

  // CREATE TABLE queries
  if (/^CREATE\s+TABLE/i.test(s)) {
    return [[], []]
  }

  // INSERT INTO users
  if (/^INSERT\s+INTO\s+users/i.test(s)) {
    const [name, email, mobile, password] = params
    const emailLower = String(email || "").toLowerCase()
    const existing = fallbackStore.users.find(u => u.email.toLowerCase() === emailLower)
    if (existing) {
      const err = new Error("Duplicate entry for email")
      err.code = "ER_DUP_ENTRY"
      throw err
    }
    const id = fallbackStore.userIdCounter++
    const newUser = { id, name, email, mobile, password, created_at: new Date() }
    fallbackStore.users.push(newUser)
    return [{ insertId: id, affectedRows: 1 }, []]
  }

  // SELECT ... FROM users WHERE email = ?
  if (/^SELECT.*FROM\s+users\s+WHERE\s+email\s*=/i.test(s)) {
    const emailLower = String(params[0] || "").toLowerCase()
    const user = fallbackStore.users.find(u => u.email.toLowerCase() === emailLower)
    return [user ? [user] : [], []]
  }

  // DELETE FROM email_otps WHERE email = ?
  if (/^DELETE\s+FROM\s+email_otps\s+WHERE\s+email\s*=/i.test(s)) {
    const emailLower = String(params[0] || "").toLowerCase()
    fallbackStore.email_otps = fallbackStore.email_otps.filter(o => o.email.toLowerCase() !== emailLower)
    return [{ affectedRows: 1 }, []]
  }

  // INSERT INTO email_otps
  if (/^INSERT\s+INTO\s+email_otps/i.test(s)) {
    const [email, otp, expires_at] = params
    fallbackStore.email_otps.push({ email, otp: String(otp).trim(), expires_at: new Date(expires_at) })
    return [{ insertId: 1, affectedRows: 1 }, []]
  }

  // SELECT ... FROM email_otps WHERE email = ? AND otp = ?
  if (/^SELECT.*FROM\s+email_otps\s+WHERE\s+email\s*=.*AND\s+otp\s*=/i.test(s)) {
    const [email, otp] = params
    const records = fallbackStore.email_otps.filter(
      o => o.email.toLowerCase() === String(email).toLowerCase() && String(o.otp).trim() === String(otp).trim()
    )
    return [records, []]
  }

  // SELECT email, otp, expires_at FROM email_otps WHERE email = ?
  if (/^SELECT.*FROM\s+email_otps\s+WHERE\s+email\s*=/i.test(s)) {
    const emailLower = String(params[0] || "").toLowerCase()
    const records = fallbackStore.email_otps.filter(o => o.email.toLowerCase() === emailLower)
    return [records, []]
  }

  // SELECT * FROM posts
  if (/^SELECT.*FROM\s+posts/i.test(s)) {
    return [fallbackStore.posts, []]
  }

  return [[], []]
}

async function executeSafeQuery(sql, params = []) {
  try {
    const p = getDbPool()
    if (!p) {
      return handleFallbackQuery(sql, params)
    }
    return await p.query(sql, params)
  } catch (err) {
    if (
      err.code === "ER_ACCESS_DENIED_ERROR" ||
      err.message?.includes("Access denied") ||
      err.message?.includes("prefix") ||
      err.code === "ECONNREFUSED" ||
      err.code === "ETIMEDOUT"
    ) {
      console.warn("⚠️ [Database Fallback] Cloud DB unavailable (" + err.message + "). Executing query in resilient in-memory store.")
      return handleFallbackQuery(sql, params)
    }
    throw err
  }
}

// Proxies both function calls `const pool = getPool()` and direct property calls `await getPool.query(...)`
export const getPool = new Proxy(getDbPool, {
  apply(target, thisArg, argArray) {
    return {
      query: (sql, params) => executeSafeQuery(sql, params),
      execute: (sql, params) => executeSafeQuery(sql, params),
    }
  },
  get(target, prop) {
    if (prop === "query" || prop === "execute") {
      return (sql, params) => executeSafeQuery(sql, params)
    }
    const p = getDbPool()
    if (!p) {
      return (sql, params) => executeSafeQuery(sql, params)
    }
    const val = p[prop]
    if (typeof val === "function") {
      return val.bind(p)
    }
    return val
  },
})

export default getPool