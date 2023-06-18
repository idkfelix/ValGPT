import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';
import { setupWebSocket } from './websocket';

const app = express();
const port = 1337;
app.use(express.json());
app.use(cors());

app.use('/', routes);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server up: http://localhost:${port}`);
});

export const websocket = setupWebSocket(server);