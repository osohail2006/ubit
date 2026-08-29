import { pool } from "@/lib/pg";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");
    return Response.json({ connected: true, time: result.rows[0] });
  } catch (error) {
    const err = error as Error;
    return Response.json({ connected: false, error: err.message },{});
  }
}
