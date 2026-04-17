import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const res1 = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_code1'");
    const res2 = await pool.query("SELECT value FROM admin_settings WHERE key = 'admin_code2'");
    return NextResponse.json({
      code1: res1.rows[0]?.value || "lorenzo",
      code2: res2.rows[0]?.value || "davide"
    });
  } catch (error) {
    return NextResponse.json({ error: "Errore caricamento impostazioni" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code1, code2 } = await req.json();
    await pool.query("UPDATE admin_settings SET value = $1 WHERE key = 'admin_code1'", [code1]);
    await pool.query("UPDATE admin_settings SET value = $2 WHERE key = 'admin_code2'", [code2]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Errore aggiornamento codici" }, { status: 500 });
  }
}
