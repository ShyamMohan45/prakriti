


import jwt from "jsonwebtoken"

export function signToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set. Please configure .env.local")
  }
  
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
    secret,
    { expiresIn: "7d" }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
}
