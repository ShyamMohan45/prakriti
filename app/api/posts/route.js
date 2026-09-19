
import { NextResponse } from "next/server"
import { getPool } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [posts] = await getPool.query("SELECT * FROM posts")

    return NextResponse.json({
      success: true,
      posts,
    })
  } catch (err) {
    console.error("POSTS ERROR:", err)
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    )
  }
}
