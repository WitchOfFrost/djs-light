import WebSocket from "ws";
import { logger } from "../index.mjs";
import { loginIntents } from "./bitField.mjs";

let seq = null;
let sessionToken = null;

/**
 * 
 * @param {string} token 
 * @param {Array || !number} intents 
 * @param {Object} socketData 
 * @param {boolean} resume 
 */
export default async function wsHandler(token, intents, socketData, resume) {
    const ws = new WebSocket(`${socketData.data.url}/?v=9&encoding=json`);
    let heartbeatInterval;

    ws.on('close', function close(data, isBinary) {
        switch (data) {
            case 4000:
                wsHandler(token, intents, socketData, true);
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4000 UNKNOWN || RECONNECTING"
                });
                break;

            case 4001:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4001 INVALID_OPCODE || EXITING"
                });
                process.exit(1);

            case 4002:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4002 INVALID_PAYLOAD || EXITING"
                });
                process.exit(1);

            case 4003:
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4003 NOT_AUTHENTICATED || WARNING"
                });
                break;

            case 4004:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4004 INVALID_AUTHENTICATION || EXITING"
                });
                process.exit(1);

            case 4005:
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4005 ALREADY_AUTHENTICATED || WARNING"
                });
                break;

            case 4007:
                wsHandler(token, intents, socketData, false);
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4007 INVALID_SEQ || RECONNECTING WITH NEW SESSION"
                });
                break;

            case 4008:
                wsHandler(token, intents, socketData, true);
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4008 RATE_LIMITED || RECONNECTING"
                });
                break;

            case 4009:
                wsHandler(token, intents, socketData, false);
                logger.log({
                    level: 'warn',
                    message: "WARN || ws.on('close') || ERR 4009 SESSION_TIMEOUT || RECONNECTING WITH NEW SESSION"
                });
                break;

            case 4010:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4010 INVALID_SHARD || EXITING"
                });
                process.exit(1);

            case 4011:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4011 SHARDING_REQUIRED || EXITING"
                });
                process.exit(1);

            case 4012:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4012 INVALID_API_VERSION || EXITING"
                });
                process.exit(1);

            case 4013:
                logger.log({
                    level: 'err',
                    message: "ERR || ws.on('close') || ERR 4013 INVALID_INTENTS || EXITING"
                });
                process.exit(1);

            case 4014:
                logger.log({
                    level: 'error',
                    message: "ERR || ws.on('close') || ERR 4014 DISALLOWED_INTENT || EXITING"
                });
                process.exit(1);

            default:
                wsHandler(token, intents, socketData, true);
                logger.log({
                    level: 'warn',
                    message: `WARN || ws.on('close') || UNKNOWN ERROR CODE || ${data}`
                });
                break;
        };
    });


    ws.on('message', async function incoming(data, isBinary) {
        let parsedData = JSON.parse(data);

        if (parsedData.s != null) {
            seq = parsedData.s
        };

        switch (parsedData.op) {
            case 0:
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC OPCODE 0"
                });
                break;

            case 1:
                ws.send(JSON.stringify({ "op": 1, "s": seq }));
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC OPCODE 1, SENT OPCODE 1"
                });
                break;

            case 7:
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC OPCODE 7 RECONNECT"
                });
                break;

            case 9:
                logger.log({
                    level: 'error',
                    message: "DBG || ws.on('message') || REC OPCODE 9 INVALID SESSION || Data: " + JSON.stringify(parsedData)
                });
                break;

            case 10:
                heartbeatInterval = parsedData.d.heartbeat_interval;
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || CONN || REC OPCODE 10 || Heartbeat Interval: " + parsedData.d.heartbeat_interval
                });
                setInterval(heartbeat, heartbeatInterval);
                connect();
                break;

            case 11:
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC OPCODE 11 ACK"
                });
                break;

            default:
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC UNHANDLED EVENT || Data: " + JSON.stringify(parsedData)
                });
                break;
        };

        switch (parsedData.t) {
            case null:
                break;

            case "READY":
                sessionToken = parsedData.d.session_id
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC READY EVENT || Data: " + JSON.stringify(parsedData)
                });
                break;

            default:
                logger.log({
                    level: 'debug',
                    message: "DBG || ws.on('message') || REC UNHANDLED EVENT || Data: " + JSON.stringify(parsedData)
                });
                break;
        };

        async function connect() {
            if (resume === true) {
                ws.send(JSON.stringify({ "op": 6, "d": { "token": "Bot " + token, "session_id": sessionToken, "seq": seq } }));
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || CONN || SENT OPCODE 6 RESUME || Payload: ' + JSON.stringify({ "op": 6, "d": { "token": "Bot [Token Censored]", "session_id": sessionToken, "seq": seq } })
                });
            } else {
                intents = await loginIntents(intents)
                ws.send(JSON.stringify({ "op": 2, "d": { "token": "Bot " + token, "properties": { "$os": process.platform, "$browser": "djs-light", "$device": "djs-light" }, "compression": false, "large_threshold": 50, "shard": [0, 1], "intents": intents } }));
                logger.log({
                    level: 'debug',
                    message: 'DBG || client.login() || CONN || SENT OPCODE 2 || Payload: ' + JSON.stringify({ "op": 2, "d": { "token": "Bot [Token Censored]", "properties": { "$os": process.platform, "$browser": "djs-light", "$device": "djs-light" }, "compression": false, "large_threshold": 50, "shard": [0, 1], "intents": intents } })
                });
            }
        };

        function heartbeat() {
            ws.send(JSON.stringify({ "op": 1, "d": seq }));
            logger.log({
                level: 'debug',
                message: 'DBG || client.login() || SENT OPCODE 1'
            });
        };
    });
}