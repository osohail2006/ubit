import { createClient } from "@/lib/supabase/server";
import { pool } from "@/lib/pg";


export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { first_name, last_name, department } = await request.json();
  await pool.query(
    `INSERT INTO profiles (user_id,first_name,last_name,department)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (user_id)
    DO UPDATE
    SET
        first_name = excluded.first_name,
        last_name  = excluded.last_name,
        department = excluded.department`,
    [user.id, first_name ?? null, last_name ?? null, department ?? null],
  );
  return Response.json({ ok: true });
}
