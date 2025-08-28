export default async function handler(req, res) {
  const hasIngestKey = !!process.env.TSCRIPT_INGEST_KEY;
  const hasBlobToken = !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN);
  const base = process.env.PUBLIC_BASE_URL || null;
  res.status(200).json({ ok: true, hasIngestKey, hasBlobToken, base });
}
