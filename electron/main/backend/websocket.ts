import { server as WebSocketServer } from 'websocket';
import http from 'http';

export function setupWebSocket(server: http.Server) {
  const wsServer = new WebSocketServer({
    httpServer: server,
  });

  let connection:any;

  wsServer.on('request', (request) => {
    connection = request.accept(null, request.origin);
    console.log('WebSocket connection established');
  });


  const sendMessageLog = async (user:string, body:string) => {
    if (connection) {
      try {
        connection.sendUTF(JSON.stringify({ 'user':user, 'body':body }));
      } catch (error) {
        console.error('Server Error:', error);
      }
    }
  };

  return {
    sendMessageLog,
  };
}