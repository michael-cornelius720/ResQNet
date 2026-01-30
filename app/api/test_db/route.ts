// app/api/test-db/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT 1 AS ok");
  return NextResponse.json(rows);
}
