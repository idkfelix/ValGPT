import WebSocket from 'ws';
import { getLockData } from './functions/lockData';
import { getUsername } from './functions/username';
import { websocket } from './server';
import { sendMessage } from './functions/message';
import { getCompletion } from './functions/completion';
import { profanity } from '@2toad/profanity';

const msgids:any[] = []
let isActive = false

export const toggleActive = async (state:string) => {
    if (state == 'on') {
      console.log('activated')
      isActive = true;
    } else {
      console.log('deactivated')
      isActive = false;
    }
  };

export async function valListener(key:string, prompt:string): Promise<any> {
    const messages = [
        {"role": "system", "content": prompt},
        {"role": "assistant", "name":"ValGPT", "content": "whats up?"},
    ]

    console.log(key)
    const lockData = await getLockData()
    const username = await getUsername(lockData)

    const ws = new WebSocket(`wss://riot:${lockData.password}@127.0.0.1:${lockData.port}`, {
        rejectUnauthorized: false
    });
    
    ws.on('open', () => {
        ws.send(JSON.stringify([5, 'OnJsonApiEvent']));
        console.log('Connected to websocket!');
    });

    ws.on('close', () => {
        console.log('Websocket closed!');
    });

        
    ws.on('message', async data => {
        const message = data.toString();
        if (message.length > 0) {
            const jsonResponse = JSON.parse(message);

            if (jsonResponse[2]['uri'] === "/chat/v6/messages") {
                const cmsgid = jsonResponse[2]["data"]["messages"][0]["id"];
                const msg = jsonResponse[2]["data"]["messages"][0];
                const unfixedName = msg["game_name"];
                const name = unfixedName.replace(/[^a-zA-Z0-9_-]/g, '_');
                const body = msg["body"];
                const cid = msg["cid"];
    
                if (!msgids.includes(cmsgid)) {
                    msgids.push(cmsgid)
                    messages.push({ "role": "user", "name": name, "content": body });
                    websocket.sendMessageLog(name, body)
        
                    if (name !== username && isActive == true) {
                        try {
                            const GPTmsg = await getCompletion(messages, key)
                            console.log(GPTmsg)
                            const censored = profanity.censor(GPTmsg)
                            console.log(censored)
                            sendMessage(lockData, cid, censored);
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
            }
        }        
    });
    return ws
}