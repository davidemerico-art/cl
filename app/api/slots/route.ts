import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT id, date, time, is_available as \"isAvailable\" FROM slots");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Errore caricamento slot" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, date, time, isAvailable } = await req.json();
    await pool.query(
      "INSERT INTO slots (id, date, time, is_available) VALUES ($1, $2, $3, $4)",
      [id, date, time, isAvailable]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Errore salvataggio slot" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query("UPDATE slots SET is_available = NOT is_available WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Errore aggiornamento slot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM slots WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Errore eliminazione" }, { status: 500 });
  }
}
