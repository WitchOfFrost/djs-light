import axios from "axios";
import { tokenStore } from "./client.mjs";
import { logger } from "../index.mjs";

export default {

    /**
     * 
     * @param {!number} ch 
     * @param {string} con 
     */
    send(ch, con) {
        axios({
            url: `https://discord.com/api/v9/channels/${ch}/messages`,
            method: 'post',
            headers: {
                'Authorization': 'Bot ' + tokenStore
            },
            data: con
        }).then(data => {
            logger.log({
                level: 'silly',
                message: "SILLY || SEND MESSAGE || MESSAGE SENT || RESPONSE: " + JSON.stringify(data.data)
            });
        }).catch(err => {
            logger.log({
                level: 'warn',
                message: "WARN || SEND MESSAGE || REQ ERRORED: " + err
            });
        });
    }
}