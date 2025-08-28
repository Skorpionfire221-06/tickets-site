import { put } from '@vercel/blob';
export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };
function randToken(len=48){const abc='abcdefghijklmnopqrstuvwxyz0123456789';let s='';for(let i=0;i<len;i++)s+=abc[Math.floor(Math.random()*abc.length)];return s;}
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  const expectedKey=process.env.TSCRIPT_INGEST_KEY||''; const providedKey=req.headers['x-bot-key']||'';
  if(!expectedKey||providedKey!==expectedKey)return res.status(401).end();
  let body=req.body; if(typeof body==='string'){try{body=JSON.parse(body);}catch{return res.status(400).send('invalid json');}}
  if(!body||!body.ticketId||!body.guild||!Array.isArray(body.messages))return res.status(400).send('bad payload');
  const blobToken=process.env.BLOB_READ_WRITE_TOKEN||process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if(!blobToken)return res.status(500).send('blob token missing');
  const id=String(body.ticketId); const token=randToken(48); const blobKey=`transcripts/${id}_${token}.json`;
  try{
    await put(blobKey, JSON.stringify(body), { access:'private', contentType:'application/json; charset=utf-8', token: blobToken });
  }catch(e){ console.error('Blob put failed:', e); return res.status(500).send('blob put failed: '+(e?.message||'unknown')); }
  const base=(process.env.PUBLIC_BASE_URL||`${req.headers['x-forwarded-proto']||'https'}://${req.headers.host}`).replace(/\/+$/,'');
  const viewUrl=`${base}/t/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`;
  res.status(200).json({ id, viewUrl });
}
