import { get } from '@vercel/blob';
export default async function handler(req, res) {
  const id = String(req.query.id || '');
  const token = String(req.query.token || '');
  if (!id || !token) return res.status(400).end();
  const key = `transcripts/${id}_${token}.json`;
  try {
    const { body } = await get(key);
    res.setHeader('content-type','application/json; charset=utf-8');
    body.pipe(res);
  } catch {
    res.status(404).end();
  }
}
