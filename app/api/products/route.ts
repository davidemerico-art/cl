import { NextResponse } from "next/server";
import pool, { initDb } from "@/lib/db";

export async function GET() {
  await initDb();
  try {
    const result = await pool.query("SELECT * FROM products");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Errore caricamento prodotti" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, name, description, price, image, type } = await req.json();
    await pool.query(
      "INSERT INTO products (id, name, description, price, image, type) VALUES ($1, $2, $3, $4, $5, $6)",
      [id, name, description, price, image, type]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Errore salvataggio prodotto" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Errore eliminazione" }, { status: 500 });
  }
}
