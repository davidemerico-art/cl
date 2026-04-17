import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

export async function initDb() {
  const client = await pool.connect();
  try {
    // Tabella Prodotti e Tagli
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        type TEXT NOT NULL
      );
    `);

    // Tabella Appuntamenti
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        is_available BOOLEAN DEFAULT TRUE
      );
    `);

    // Tabella Impostazioni Admin
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Inizializzazione codici default se non esistono
    const res = await client.query("SELECT * FROM admin_settings WHERE key = 'admin_code1'");
    if (res.rowCount === 0) {
      await client.query("INSERT INTO admin_settings (key, value) VALUES ('admin_code1', 'lorenzo'), ('admin_code2', 'davide')");
    }

  } finally {
    client.release();
  }
}
