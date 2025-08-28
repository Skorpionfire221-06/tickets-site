import { put } from '@vercel/blob';
export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };
function randToken(len=48){ const abc='abcdefghijklmnopqrstuvwxyz0123456789'; let s=''; for(let i=0;i<len;i++) s+=abc[Math.floor(Math.random()*abc.length)]; return s; }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const key = process.env.TSCRIPT_INGEST_KEY;
  if (!key || req.headers['x-bot-key'] !== key) return res.status(401).end();
  const body = req.body || {};
  if (!body.ticketId || !body.guild || !Array.isArray(body.messages)) return res.status(400).send('bad payload');
  const id = String(body.ticketId);
  const token = randToken(48);
  const blobKey = `transcripts/${id}_${token}.json`;
  await put(blobKey, JSON.stringify(body), { access: 'private', contentType: 'application/json; charset=utf-8' });
  const base = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
  const viewUrl = `${base.replace(/\/+$/,'')}/t/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`;
  res.status(200).json({ id, viewUrl });
}
