import axios from "axios";
import WebSocket from "ws";
import { logger } from "../index.mjs";

let cachedData;

export default {
    async login(token) {
        await axios({
            url: 'https://discord.com/api/v9/gateway/bot',
            method: 'get',
            headers: {
                'Authorization': 'Bot ' + token
            }
        }).then(data => {
            cachedData = data;
        }).catch(err => {
            console.log(err);
        });

        const ws = new WebSocket(`${cachedData.data.url}/?v=9&encoding=json`);
        let heartbeatInterval;

        ws.on('message', async function incoming(data, isBinary) {
            let parsedData = await JSON.parse(data);
            if (parsedData.op == 1) {
                ws.send(JSON.stringify({ "op": 1 }));
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || REC OPCODE 1, SENT OPCODE 1'
                });
            }

            if (parsedData.op == 11) {
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || REC OPCODE 11 ACK'
                });
            }

            if (parsedData.op == 10) {
                heartbeatInterval = parsedData.d.heartbeat_interval;
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || CONN || REC OPCODE 10 || Heartbeat Interval: ' + parsedData.d.heartbeat_interval
                });
                setInterval(heartbeat, heartbeatInterval);
            };

            function heartbeat() {
                ws.send(JSON.stringify({ "op": 1, "d": parsedData.s }));
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || SENT OPCODE 1'
                });
            }
        });

    }
}