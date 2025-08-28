import { put } from '@vercel/blob';
export default async function handler(req,res){
  try{
    const token=process.env.BLOB_READ_WRITE_TOKEN||process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if(!token)return res.status(500).json({ok:false,error:'blob token missing'});
    const key=`transcripts/_selftest2_${Date.now()}.json`;
    await put(key,JSON.stringify({ok:true,t:Date.now(),route:'selftest2',access:'public'}),{access:'public',contentType:'application/json; charset=utf-8',token});
    return res.status(200).json({ok:true,key,route:'selftest2',access:'public'});
  }catch(e){
    return res.status(500).json({ok:false,error:e?.message||String(e),route:'selftest2'});
  }
}
