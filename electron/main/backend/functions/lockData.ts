import { join } from 'path';
import { readFileSync } from 'fs';

export interface LockDataType { 
  name: string; 
  pid: string; 
  port: string; 
  password: string; 
  protocol: string 
}

export function getLockData(): LockDataType {
  const lockfilePath = join(process.env.LOCALAPPDATA as string, 'Riot Games', 'Riot Client', 'Config', 'lockfile');
  const contents = readFileSync(lockfilePath, 'utf-8');
  const [name, pid, port, password, protocol] = contents.trim().split(':');
  return { name, pid, port, password, protocol };
}