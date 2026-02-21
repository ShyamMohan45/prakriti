

import { getPool } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    
    const cookieStore = await cookies()

   
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminUser = {
        id: 0,
        name: "Admin",
        email,
        role: "admin",
      }

      const token = signToken(adminUser)

  
      cookieStore.set("auth", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      })

      return NextResponse.json({
        success: true,
        user: adminUser,
      })
    }

    
    const [[user]] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "user",
    })


    cookieStore.set("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    })
  } catch (err) {
    console.error("LOGIN ERROR:", err)
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    )
  }
}
