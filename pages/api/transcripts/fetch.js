import { get } from '@vercel/blob';
export default async function handler(req,res){
  const id=String(req.query.id||''); const token=String(req.query.token||''); if(!id||!token)return res.status(400).end();
  const blobToken=process.env.BLOB_READ_WRITE_TOKEN||process.env.VERCEL_BLOB_READ_WRITE_TOKEN; const key=`transcripts/${id}_${token}.json`;
  try{ const { body } = await get(key, { token: blobToken }); res.setHeader('content-type','application/json; charset=utf-8'); body.pipe(res); }
  catch(e){ console.error('Blob get failed:', e); res.status(404).end(); }
}
