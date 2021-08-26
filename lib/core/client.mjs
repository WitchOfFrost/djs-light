import axios from "axios";
import wsHandler from "../handlers/ws.mjs";
import { logger } from "../index.mjs";

export let tokenStore;

export default {
    /**
     * 
     * @param {string} token 
     * @param {Array} intents 
     */
    async login(token, intents) {
        tokenStore = token;
        await axios({
            url: 'https://discord.com/api/v9/gateway/bot',
            method: 'get',
            headers: {
                'Authorization': 'Bot ' + tokenStore
            }
        }).then(data => {
            wsHandler(tokenStore, intents, data, false);
            logger.log({
                level: 'debug',
                message: "DBG || GET GATEWAY || REC GATEWAY INFO: " + JSON.stringify(data.data)
            });
        }).catch(err => {
            logger.log({
                level: 'error',
                message: "ERR || GET GATEWAY || REQ ERRORED: " + err + " EXITING"
            });
            process.exit(1);
        });
    }
}