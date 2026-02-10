import { getPool } from "@/lib/db";

export type GenerationRecord = {
  id: string;
  type: string;
  input: unknown;
  output: unknown;
  output_text: string;
  created_at: string;
  view_count: number;
  remix_count: number;
};

export async function insertGeneration(data: {
  type: string;
  input: unknown;
  output: unknown;
  output_text: string;
}) {
  const pool = getPool();
  const result = await pool.query<GenerationRecord>(
    `insert into generations (type, input, output, output_text)
     values ($1, $2, $3, $4)
     returning *`,
    [data.type, data.input, data.output, data.output_text],
  );
  return result.rows[0];
}

export async function getGenerationById(id: string) {
  const pool = getPool();
  const result = await pool.query<GenerationRecord>(
    `select * from generations where id = $1 limit 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function incrementView(id: string) {
  const pool = getPool();
  await pool.query(
    `update generations set view_count = view_count + 1 where id = $1`,
    [id],
  );
}

export async function incrementRemix(id: string) {
  const pool = getPool();
  await pool.query(
    `update generations set remix_count = remix_count + 1 where id = $1`,
    [id],
  );
}

export async function getTrending(days: number, limit: number) {
  const pool = getPool();
  const result = await pool.query<GenerationRecord>(
    `select id, type, output_text
     from generations
     where created_at >= now() - ($1 || ' days')::interval
     order by view_count desc
     limit $2`,
    [days, limit],
  );
  return result.rows;
}
