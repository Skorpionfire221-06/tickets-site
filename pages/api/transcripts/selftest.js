import { put } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) return res.status(500).json({ ok:false, error:'blob token missing' });

    const key = `transcripts/_selftest_${Date.now()}.json`;
    await put(key, JSON.stringify({ ok:true, t: Date.now() }), {
      access: 'private',
      contentType: 'application/json; charset=utf-8',
      token
    });

    return res.status(200).json({ ok:true, key });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e?.message || String(e) });
  }
}
