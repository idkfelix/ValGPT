import { LockDataType } from './lockData';
import axios from 'axios';
import { Buffer } from 'buffer';

export async function getUsername(lockData: LockDataType): Promise<string> {
  const url = `https://127.0.0.1:${lockData.port}/player-account/aliases/v1/active`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`riot:${lockData.password}`).toString('base64')}`,
  };

  const response = await axios.get(url, {
    headers: headers,
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });

  return response.data.game_name;
}
