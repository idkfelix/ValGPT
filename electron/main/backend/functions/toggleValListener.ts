import { valListener } from "../valListener";

let isListening = false;
let websocket: WebSocket | null = null;

export const toggleValListener = async (key:string, state:any) => {
  if (state == 'on') {
    websocket = await valListener(key);
    isListening = true;
  } else {
    if (websocket) {
      websocket.close();
    }
    isListening = false;
  }
};