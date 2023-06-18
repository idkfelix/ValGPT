import express from 'express';
import { getLockData } from './functions/lockData';
import { getUsername } from './functions/username';
import { sendMessage } from './functions/message';
import { toggleValListener } from './functions/toggleValListener';
import { toggleActive } from './valListener';

const router = express.Router();
const lockFile = getLockData();

router.get('/api/username', async (req, res) => {
  try {
    const username = await getUsername(lockFile);
    res.status(200).json({ "username": username });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/api/sendMsg', async (req, res) => {
  try {
    const msgg = await sendMessage(lockFile, req.body.cid, req.body.msg);
    res.status(200).json(msgg);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
})

router.post('/api/toggleWs/:state', (req:any, res) => {
  try {
    toggleValListener(req.body.key, req.params.state);
    res.sendStatus(200);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/api/toggleActive/:state', (req:any, res) => {
  try {
    toggleActive(req.params.state);
    res.sendStatus(200);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
