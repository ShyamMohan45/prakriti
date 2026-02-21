


import { getPool } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
   
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

   
    const admin = verifyToken(token);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { message: "You are not an admin. This page is only for admin." },
        { status: 403 }
      );
    }

   
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    let userId;
    let userEmail;

   
    if (email) {
      const [[user]] = await db.query(
        "SELECT id, email FROM users WHERE email = ?",
        [email]
      );

      if (!user) {
        return NextResponse.json(
          { message: "User not registered" },
          { status: 404 }
        );
      }

      userId = user.id;
      userEmail = user.email;
    } else {
     
      const [[self]] = await db.query(
        "SELECT id, email FROM users WHERE email = ?",
        [admin.email]
      );

      userId = self.id;
      userEmail = self.email;
    }


    const [[lastAnalysis]] = await db.query(
      `
      SELECT summary, created_at
      FROM medical_analyses
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );


    const [analyses] = await db.query(
      `
      SELECT summary, created_at
      FROM medical_analyses
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

  
    return NextResponse.json({
      user: {
        email: userEmail,
        lastLogin: "Today",
        docs: analyses.length,
      },
      clinical: lastAnalysis
        ? {
            summary: lastAnalysis.summary,
            condition: "No Critical Condition",
            severity: "GREEN",
            lastAnalyzed: "Recently",
          }
        : {
            summary: "No analysis available",
            condition: "-",
            severity: "-",
            lastAnalyzed: "-",
          },
      analyses,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
