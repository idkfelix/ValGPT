import { LockDataType } from './lockData';
import axios from 'axios';
import { Buffer } from 'buffer';

export async function sendMessage(lockData: LockDataType, cid:string, msg:string): Promise<string> {
  const url = `https://127.0.0.1:${lockData.port}/chat/v6/messages/`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`riot:${lockData.password}`).toString('base64')}`,
  };

  const data = {
    "cid": cid,
    "message": msg,
    "type": "groupchat"
}

  const response = await axios.post(url, data, {
    headers: headers,
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });

  return response.data;
}
